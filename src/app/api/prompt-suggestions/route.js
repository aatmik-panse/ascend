import { NextResponse } from "next/server";
import { getUser } from "@/queries/user";
import prisma from "@/lib/prisma";

// POST handler for creating a new prompt suggestion
export async function POST(request) {
  try {
    const { text } = await request.json();

    // Validate input
    if (!text || typeof text !== "string" || text.trim() === "") {
      return NextResponse.json(
        { error: "Prompt suggestion text is required" },
        { status: 400 }
      );
    }

    // Get user ID from auth (optional - can be null for anonymous suggestions)
    const user = await getUser();
    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const userId = user.id; // Assuming userId is an object with an id property

    // Create the prompt suggestion in database
    const promptSuggestion = await prisma.promptSuggestion.create({
      data: {
        text: text.trim(),
        userId,
        status: "PENDING", // Default status
      },
    });

    return NextResponse.json(
      { success: true, promptSuggestion },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating prompt suggestion:", error);
    return NextResponse.json(
      { error: "Failed to create prompt suggestion" },
      { status: 500 }
    );
  }
}

// GET handler for retrieving prompt suggestions (admin use)
export async function GET(request) {
  try {
    const userId = await getUserId(request);

    // Check if user is an admin (implement your own admin check)
    // const isAdmin = await checkIfUserIsAdmin(userId);
    // if (!isAdmin) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    const promptSuggestions = await prisma.promptSuggestion.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ promptSuggestions });
  } catch (error) {
    console.error("Error fetching prompt suggestions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt suggestions" },
      { status: 500 }
    );
  }
}
