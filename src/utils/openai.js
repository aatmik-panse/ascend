import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper functions for common OpenAI operations
export const openaiService = {
  // Generate chat completion
  async createChatCompletion(messages, options = {}) {
    const defaultOptions = {
      model: "gpt-4.1-mini-2025-04-14",
      temperature: 0.7,
      max_tokens: 1200,
    };

    const requestOptions = { ...defaultOptions, ...options, messages };

    return await openai.chat.completions.create(requestOptions);
  },

  // List available models
  async listModels() {
    return await openai.models.list();
  },

  // Create embeddings for text
  async createEmbedding(input, model = "text-embedding-3-small") {
    return await openai.embeddings.create({
      model,
      input,
    });
  },

  // Initialize a career counseling conversation with a well-structured system prompt
  async getCareerCounselingBot(customInstructions = {}) {
    const defaultInstructions = {
      expertise: [
        "career planning",
        "job searching",
        "skill development",
        "resume building",
      ],
      tone: "supportive and professional",
      responseLength: "concise but comprehensive",
      userLevel: "diverse professionals",
    };

    const instructions = { ...defaultInstructions, ...customInstructions };

    const systemPrompt = `
# Career Counseling Assistant

## Role and Purpose
You are a professional career counselor specializing in ${instructions.expertise.join(
      ", "
    )}. Your purpose is to provide personalized guidance to help individuals make informed career decisions and achieve their professional goals.

## Expertise and Capabilities
- Assess career aptitudes and interests
- Provide job market insights and trends
- Recommend skill development opportunities
- Assist with resume building and interview preparation
- Help with career transitions and advancement strategies
- Offer work-life balance advice

## Response Guidelines
- Maintain a ${instructions.tone} tone
- Provide ${instructions.responseLength} responses
- Adapt your advice for ${instructions.userLevel}
- Ask clarifying questions when needed
- Provide actionable next steps
- Cite sources when discussing market trends or statistics

## Constraints
- Avoid making unrealistic promises about career outcomes
- Do not provide specific salary figures without qualifying them by region and experience level
- Focus on empowering users with information rather than making decisions for them
- Avoid political or controversial content
- When user data is provided in your context, use it to personalize advice without explicitly mentioning you have this data

## Interaction Style
1. Start by understanding the user's current situation and career goals
2. Provide personalized insights based on the user's specific context
3. Suggest concrete, practical steps for career development
4. Check if additional clarification or information is needed
5. Summarize key takeaways when appropriate
`;

    return {
      systemPrompt,
      initializeChat: async (userQuery) => {
        const messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: userQuery },
        ];

        return await openaiService.createChatCompletion(messages, {
          temperature: 0.6, // Slightly lower temperature for more reliable advice
          max_tokens: 1500, // Higher token limit for comprehensive guidance
        });
      },
    };
  },
};
