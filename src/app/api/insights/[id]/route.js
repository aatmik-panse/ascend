import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request, { params }) {
  const userId = params.id;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category');
  
  try {
    const supabase = await createClient();
    
    // Start building the query
    let query = supabase
      .from('career_insights')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);
    
    // Add category filter if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({
      insights: data || [],
      pagination: {
        page,
        limit,
        total: count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch career insights' }, { status: 500 });
  }
}
