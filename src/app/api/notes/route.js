import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/queries/user";

// GET handler for retrieving user's notes
export async function GET(request) {
  try {
    // Get authenticated user from Supabase - fix by properly awaiting createClient()
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get notes from Prisma DB
    const notes = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes", message: error.message },
      { status: 500 }
    );
  }
}

// POST handler for creating a new note
export async function POST(request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 }
      );
    }

    // Get authenticated user directly - getUser() already handles the await for createClient()
    const user = await getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Create note in database
    const note = await prisma.note.create({
      data: {
        text,
        userId: user.id,
        conversationId: body.conversationId || null,
      },
    });

    return NextResponse.json(
      { message: "Note saved successfully", note },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving note:", error);
    return NextResponse.json(
      { error: "Failed to save note", message: error.message },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a note by ID
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const noteId = searchParams.get("id");

    if (!noteId) {
      return NextResponse.json(
        { error: "Note ID is required" },
        { status: 400 }
      );
    }

    // Get authenticated user - fix by properly awaiting createClient()
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // First check if the note belongs to this user
    const noteToDelete = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!noteToDelete) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    if (noteToDelete.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this note" },
        { status: 403 }
      );
    }

    // Delete the note
    await prisma.note.delete({
      where: { id: noteId },
    });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note", message: error.message },
      { status: 500 }
    );
  }
}
