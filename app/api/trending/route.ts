import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000); // last 24h

    const trending = await prisma.confession.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        text: true,
        department: true,
        views: true,
      },
    });

    return NextResponse.json(trending, { status: 200 });
  } catch (error) {
    console.error("GET /api/trending error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending confessions" },
      { status: 500 }
    );
  }
}
