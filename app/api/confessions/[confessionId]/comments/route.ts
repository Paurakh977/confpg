import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ confessionId: string }> }
) {
  try {
    const { confessionId } = await context.params; // ✅ unwrap Promise

    const comments = await prisma.comment.findMany({
      where: { confessionId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    console.error("GET comments error:", err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ confessionId: string }> }
) {
  try {
    const { confessionId } = await context.params; // ✅ unwrap Promise
    const { text } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: {
        text,
        confessionId,
        upvotes: 0,
        downvotes: 0,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (err) {
    console.error("POST comment error:", err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
