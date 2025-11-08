import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, context: { params: Promise<{ confessionId: string; commentId: string }> }) {
  const { confessionId, commentId } = await context.params;

  try {
    if (!commentId) {
      return NextResponse.json({ error: "Missing comment ID" }, { status: 400 });
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { downvotes: { increment: 1 } },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Comment downvote error:", error);
    return NextResponse.json({ error: "Failed to downvote comment" }, { status: 500 });
  }
}
