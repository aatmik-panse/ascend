import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request, { params }) {
  const userId = params.id;
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    // Get user data from Supabase
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }
    
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 });
  }
}
