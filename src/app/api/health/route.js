import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // Check Supabase connection
  let supabaseStatus = "healthy";
  try {
    const { error } = await supabase.from('health_check').select('id').limit(1);
    if (error) {
      supabaseStatus = "error";
    }
  } catch (e) {
    supabaseStatus = "error";
  }
  
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      supabase: supabaseStatus,
      openai: process.env.OPENAI_API_KEY ? "healthy" : "not_configured",
      server: "healthy"
    },
    version: "1.0.0"
  });
}
