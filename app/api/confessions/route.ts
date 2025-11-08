// app/api/confessions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Department } from "@prisma/client";

// GET /api/confessions → fetch all, or filter by ?department= / ?search=
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const departmentParam = searchParams.get("department"); // e.g. CS
    const search = searchParams.get("search") || undefined;

    const where: any = {};

    // department filter (enum-safe)
    if (departmentParam) {
      const dep = departmentParam.toUpperCase();

      if ((Object.values(Department) as string[]).includes(dep)) {
        where.department = dep as Department;
      }
      // if dep is not a valid enum, we just don't add a filter instead of crashing
    }

    // search filter: text + optional year
    if (search) {
      const or: any[] = [
        {
          text: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];

      const asNumber = Number(search);
      if (!Number.isNaN(asNumber)) {
        or.push({ year: asNumber });
      }

      // If there is already a department filter, this becomes AND(department, OR(...))
      where.OR = or;
    }

    const confessions = await prisma.confession.findMany({
      where: Object.keys(where).length ? where : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(confessions, { status: 200 });
  } catch (error) {
    console.error("GET /api/confessions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch confessions" },
      { status: 500 }
    );
  }
}

// POST /api/confessions → create a new confession
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, department, gender, year } = body;

    if (!text || !department) {
      return NextResponse.json(
        { error: "Text and department are required." },
        { status: 400 }
      );
    }

    if (year && (year < 1 || year > 4)) {
      return NextResponse.json(
        { error: "Year must be between 1 and 4." },
        { status: 400 }
      );
    }

    // validate department against enum to avoid runtime errors
    const depUpper = String(department).toUpperCase();
    if (!(Object.values(Department) as string[]).includes(depUpper)) {
      return NextResponse.json(
        { error: "Invalid department code." },
        { status: 400 }
      );
    }

    const newConfession = await prisma.confession.create({
      data: {
        text,
        department: depUpper as Department,
        gender: gender ?? null,
        year: year ?? null,
        upvotes: 0,
        downvotes: 0,
        commentsCount: 0,
        views: 0,
      },
    });

    return NextResponse.json(newConfession, { status: 201 });
  } catch (error) {
    console.error("POST /api/confessions error:", error);
    return NextResponse.json(
      { error: "Failed to create confession" },
      { status: 500 }
    );
  }
}
