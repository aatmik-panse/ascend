import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";
import { ensureUserExists } from "../utils/userSync";

const prisma = new PrismaClient();

// POST handler for creating a new note
export async function POST(request) {
  try {
    const { text, conversationId } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json(
        { error: "Note text is required" },
        { status: 400 }
      );
    }

    // Get authenticated user
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

    // Ensure user exists in our database
    const dbUser = await ensureUserExists(user);

    // Create note in database
    const note = await prisma.note.create({
      data: {
        text,
        userId: dbUser.id,
        conversationId,
      },
    });

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note", message: error.message },
      { status: 500 }
    );
  }
}

// GET handler for retrieving notes
export async function GET(request) {
  try {
    // Get authenticated user
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

    // Ensure user exists in our database
    await ensureUserExists(user);

    const notes = await prisma.note.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return NextResponse.json(
      { error: "Failed to retrieve notes", message: error.message },
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

    // Get authenticated user
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

    // Ensure user exists in our database
    await ensureUserExists(user);

    // Find the note to delete
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
