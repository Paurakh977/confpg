import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { confessionId: id },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(comments);
  } catch (e) {
    console.error("GET /comments error:", e);
    return NextResponse.json({ error: "Failed to load comments" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    const { text } = await req.json();
    if (!text?.trim()) {
      return NextResponse.json({ error: "Empty comment" }, { status: 400 });
    }

    const newComment = await prisma.comment.create({
      data: { confessionId: id, text },
    });

    await prisma.confession.update({
      where: { id },
      data: { commentsCount: { increment: 1 } },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (e) {
    console.error("POST /comments error:", e);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
