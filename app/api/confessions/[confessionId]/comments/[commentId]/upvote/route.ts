import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  context: { params: Promise<{ confessionId: string; commentId: string }> }
) {
  const { confessionId, commentId } = await context.params;

  console.log("🧩 DEBUG PARAMS:", { confessionId, commentId });

  if (!confessionId || !commentId) {
    return NextResponse.json(
      { error: "Missing confessionId or commentId", received: { confessionId, commentId } },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { upvotes: { increment: 1 } },
    });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Comment upvote error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
