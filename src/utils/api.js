import { createClient } from "@/utils/supabase/client";
import prisma from "@/lib/prisma"; // Using the existing Prisma client

// Use relative paths instead of hardcoded URL
export const API_BASE_URL = "";

export async function checkBackendHealth() {
  console.log("Checking backend health");
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    const data = await response.json();
    console.log("Backend health check response:", data);
    return data;
  } catch (error) {
    return {
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        supabase: "error",
        openai: "error",
        server: "error",
      },
      error: "Failed to connect to backend",
      version: "1.0.0",
    };
  }
}

/**
 * Fetches user data from Supabase
 * @param {string} userId - The user ID to fetch data for
 * @returns {Promise<Object>} - The user data
 */
export async function fetchUserData(userId) {
  if (!userId) {
    console.error("User ID is required");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

/**
 * Fetches career insights data from Supabase
 * @param {string} userId - The user ID to fetch insights for
 * @param {Object} options - Additional options for filtering insights
 * @returns {Promise<Array>} - Array of career insights
 */
export async function fetchCareerInsights(userId, options = {}) {
  if (!userId) {
    console.error("User ID is required");
    return { insights: [] };
  }

  const { limit = 10, page = 1, category } = options;
  let url = `${API_BASE_URL}/api/insights/${userId}?limit=${limit}&page=${page}`;

  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching career insights:", error);
    return { insights: [] };
  }
}

/**
 * Adds a user to the waitlist
 * @param {Object} userData - User data to add to the waitlist
 * @param {string} userData.email - User's email address
 * @returns {Promise<Object>} - The created waitlist entry
 */
export async function addToWaitlist(userData) {
  // Validate required fields
  if (!userData.email) {
    throw new Error("Email is required");
  }

  try {
    // Use the API route instead of direct database access
    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userData.email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to join waitlist");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding to waitlist:", error);
    throw error;
  }
}
