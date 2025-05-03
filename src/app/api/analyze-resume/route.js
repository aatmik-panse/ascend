import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { resumeText, jobDescription, targetRole } = await req.json();

    if (!resumeText || !jobDescription || !targetRole) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare prompt for the OpenAI API
    const prompt = `
    You are an expert resume reviewer and career coach. Analyze the resume and job description below.
    
    Target Role: ${targetRole}
    
    Resume:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Provide a detailed analysis including:
    1. A match percentage score (0-100)
    2. An overall resume quality score (0-100)
    3. A list of important keywords present in the resume
    4. A list of important keywords missing from the resume but present in the job description
    5. Specific improvement suggestions for different sections (Skills, Experience, Education, Projects)
    6. Skills gaps between the resume and job requirements, with importance level (High/Medium/Low)
    
    Format your response as a JSON object with the following structure:
    {
      "score": number,
      "matchPercentage": number,
      "keywords": {
        "present": [string],
        "missing": [string]
      },
      "missingKeywords": [string],
      "suggestions": [
        {
          "section": string,
          "suggestion": string
        }
      ],
      "skillGaps": [
        {
          "skill": string,
          "importance": string
        }
      ]
    }
    `;

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini-2025-04-14",
      temperature: 0.3, // Lower temperature for more focused/analytical response
      messages: [
        {
          role: "system",
          content:
            "You are an expert resume reviewer and career coach. Provide detailed analysis in JSON format only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    // Parse and return the OpenAI response
    const responseText = completion.choices[0].message.content;

    // Ensure we can parse the response as JSON
    try {
      const analysisResult = JSON.parse(responseText);

      // Validate required fields in the response
      if (!analysisResult.score) analysisResult.score = 50;
      if (!analysisResult.matchPercentage) analysisResult.matchPercentage = 50;
      if (!analysisResult.keywords)
        analysisResult.keywords = { present: [], missing: [] };
      if (!analysisResult.missingKeywords) analysisResult.missingKeywords = [];
      if (!analysisResult.suggestions) analysisResult.suggestions = [];
      if (!analysisResult.skillGaps) analysisResult.skillGaps = [];

      return NextResponse.json(analysisResult);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", parseError);
      return NextResponse.json(
        {
          error: "Failed to parse analysis results",
          score: 50,
          matchPercentage: 50,
          keywords: { present: [], missing: [] },
          missingKeywords: [],
          suggestions: [],
          skillGaps: [],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Resume analysis error:", error);

    return NextResponse.json(
      {
        error: "Failed to analyze resume. Please try again.",
        score: 0,
        matchPercentage: 0,
        keywords: { present: [], missing: [] },
        missingKeywords: [],
        suggestions: [],
        skillGaps: [],
      },
      { status: 500 }
    );
  }
}
