import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Create timestamp
    const created_at = new Date().toISOString();

    // Determine which database to use
    const useSupabase = process.env.USE_SUPABASE !== "false";

    // Use Prisma (this runs on the server, so it's safe)
    const result = await prisma.waitlist.create({
      data: {
        email,
        created_at: new Date(created_at),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in waitlist API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
