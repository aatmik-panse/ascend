import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// Update the selected roadmap for a user's career path
export async function POST(req) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { testId, recommendationIndex } = await req.json();

    if (!testId || recommendationIndex === undefined) {
      return NextResponse.json(
        { error: "Test ID and recommendation index are required" },
        { status: 400 }
      );
    }

    // Get the test to verify ownership and access recommendations
    const test = await prisma.careerPathTest.findUnique({
      where: {
        id: testId,
        userId: user.id,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    // Validate the recommendation index
    if (
      recommendationIndex < 0 ||
      recommendationIndex >= test.recommendations.length
    ) {
      return NextResponse.json(
        { error: "Invalid recommendation index" },
        { status: 400 }
      );
    }

    // Update the test with the selected roadmap index
    const updatedTest = await prisma.careerPathTest.update({
      where: {
        id: testId,
      },
      data: {
        selectedRoadmapIndex: recommendationIndex,
      },
    });

    return NextResponse.json({
      success: true,
      selectedRoadmapIndex: updatedTest.selectedRoadmapIndex,
    });
  } catch (error) {
    console.error("Error updating selected roadmap:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap: " + error.message },
      { status: 500 }
    );
  }
}

// Get the selected roadmap for a user's career path test
export async function GET(req) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check URL params
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    if (!testId) {
      return NextResponse.json(
        { error: "Test ID is required" },
        { status: 400 }
      );
    }

    // Get the test with the selected roadmap
    const test = await prisma.careerPathTest.findUnique({
      where: {
        id: testId,
        userId: user.id,
      },
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({
      selectedRoadmapIndex: test.selectedRoadmapIndex || 0,
      recommendations: test.recommendations,
    });
  } catch (error) {
    console.error("Error fetching selected roadmap:", error);
    return NextResponse.json(
      { error: "Failed to fetch roadmap: " + error.message },
      { status: 500 }
    );
  }
}
