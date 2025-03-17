export const API_BASE_URL = 'http://localhost:1234';

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