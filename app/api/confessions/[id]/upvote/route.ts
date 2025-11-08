import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> } // 👈 params is a Promise
) {
  try {
    const { id } = await context.params; // 👈 must await it

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updated = await prisma.confession.update({
      where: { id },
      data: { upvotes: { increment: 1 } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("POST /upvote error:", error);
    return NextResponse.json(
      { error: "Failed to upvote confession" },
      { status: 500 }
    );
  }
}
