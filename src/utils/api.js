export const API_BASE_URL = 'http://localhost:1234';

import { createClient } from '@/utils/supabase/client';

export async function checkBackendHealth() {
  console.log('Checking backend health');
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log('Backend health check response:', data);
    return data;
  } catch (error) {
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        supabase: "error",
        openai: "error",
        server: "error"
      },
      error: "Failed to connect to backend",
      version: "1.0.0"
    };
  }
}

/**
 * Fetches user data from Supabase
 * @param {string} userId - The user ID to fetch data for
 * @returns {Promise<Object>} - The user data
 */
export async function fetchUserData(userId) {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user data:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

/**
 * Fetches career insights data from Supabase
 * @param {string} userId - The user ID to fetch insights for
 * @param {Object} options - Additional options for filtering insights
 * @returns {Promise<Array>} - Array of career insights
 */
export async function fetchCareerInsights(userId, options = {}) {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('career_insights')
      .select('*')
      .eq('user_id', userId);
    
    // Apply additional filters if provided in options
    if (options.category) {
      query = query.eq('category', options.category);
    }
    
    if (options.limit) {
      query = query.limit(options.limit);
    }
    
    if (options.orderBy) {
      query = query.order(options.orderBy.column, { 
        ascending: options.orderBy.ascending 
      });
    } else {
      // Default sorting by created_at in descending order
      query = query.order('created_at', { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching career insights:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to fetch career insights:', error);
    throw error;
  }
}