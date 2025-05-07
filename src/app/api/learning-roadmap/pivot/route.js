import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

// POST endpoint to save or clear a selected pivot for a roadmap
export async function POST(req) {
  try {
    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { roadmapId, selectedPivot } = await req.json();

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    // Get the roadmap to verify ownership
    const roadmap = await prisma.learningRoadmap.findUnique({
      where: {
        id: roadmapId,
        userId: user.id,
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    // Update the roadmap with the selected pivot
    const updatedRoadmap = await prisma.learningRoadmap.update({
      where: {
        id: roadmapId,
      },
      data: {
        selectedPivot: selectedPivot, // This can be null to clear the pivot
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: selectedPivot
        ? "Pivot saved successfully"
        : "Pivot cleared successfully",
      roadmap: updatedRoadmap,
    });
  } catch (error) {
    console.error("Error updating roadmap pivot:", error);
    return NextResponse.json(
      { error: "Failed to update roadmap pivot: " + error.message },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve the selected pivot for a roadmap
export async function GET(req) {
  try {
    // Authenticate the user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get URL params
    const { searchParams } = new URL(req.url);
    const roadmapId = searchParams.get("roadmapId");

    if (!roadmapId) {
      return NextResponse.json(
        { error: "Roadmap ID is required" },
        { status: 400 }
      );
    }

    // Get the roadmap to verify ownership and retrieve the selected pivot
    const roadmap = await prisma.learningRoadmap.findUnique({
      where: {
        id: roadmapId,
        userId: user.id,
      },
      select: {
        id: true,
        selectedPivot: true,
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json({
      selectedPivot: roadmap.selectedPivot,
    });
  } catch (error) {
    console.error("Error retrieving roadmap pivot:", error);
    return NextResponse.json(
      { error: "Failed to retrieve roadmap pivot: " + error.message },
      { status: 500 }
    );
  }
}
