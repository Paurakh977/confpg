import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // 👈 await again

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const updated = await prisma.confession.update({
      where: { id },
      data: { downvotes: { increment: 1 } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("POST /downvote error:", error);
    return NextResponse.json(
      { error: "Failed to downvote confession" },
      { status: 500 }
    );
  }
}
