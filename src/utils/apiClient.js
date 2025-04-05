/**
 * Frontend API client for making requests to backend services
 */

import {
  sendChatMessage,
  fetchChatMessages,
  createChatConversation,
  fetchChatConversations,
  fetchUserData,
  fetchCareerInsights,
  checkBackendHealth
} from '@/utils/api';

class ApiClient {
  /**
   * Chat API methods
   */
  chat = {
    /**
     * Send a new message to the chat API
     * @param {string} message - Content of the message
     * @param {string} conversationId - Optional conversation ID
     */
    sendMessage: async (message, conversationId) => {
      return sendChatMessage(message, conversationId);
    },

    /**
     * Fetch messages for the current user
     * @param {string} conversationId - Optional conversation ID to filter by
     */
    getMessages: async (conversationId) => {
      return fetchChatMessages(conversationId);
    },

    /**
     * Create a new chat conversation
     * @param {string} title - Optional title for the conversation
     */
    createConversation: async (title) => {
      return createChatConversation(title);
    },

    /**
     * Get all conversations for the current user
     */
    getConversations: async () => {
      return fetchChatConversations();
    }
  };

  /**
   * User API methods
   */
  user = {
    /**
     * Fetch user data
     * @param {string} userId - ID of the user to fetch data for
     */
    getData: async (userId) => {
      return fetchUserData(userId);
    }
  };

  /**
   * Career API methods
   */
  career = {
    /**
     * Fetch career insights for a user
     * @param {string} userId - User ID
     * @param {Object} options - Filter options
     */
    getInsights: async (userId, options) => {
      return fetchCareerInsights(userId, options);
    }
  };

  /**
   * System API methods
   */
  system = {
    /**
     * Check the health status of backend services
     */
    checkHealth: async () => {
      return checkBackendHealth();
    }
  };
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;