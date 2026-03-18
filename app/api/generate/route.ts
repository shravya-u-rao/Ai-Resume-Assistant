// app/api/generate/route.ts
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { input, type } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("API KEY MISSING");
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use one of the models from your list
    // I recommend gemini-2.5-flash as it's the latest stable version
    const model = genAI.getGenerativeModel({
      // model: "models/gemini-2.5-flash" 
      model: "models/gemini-3.1-flash-lite-preview"
    });

    let prompt = "";

    if (type === "improve") {
      prompt = `Rewrite this resume professionally. Improve the language, fix grammar, and make it more impactful while keeping the same information:\n\n${input}`;
    } else if (type === "bullets") {
      prompt = `Convert this text into strong, achievement-oriented resume bullet points. Use action verbs and quantify results where possible:\n\n${input}`;
    } else {
      prompt = `Based on this job description or current skills, suggest relevant technical skills to add to a resume. Format as a comma-separated list:\n\n${input}`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      result: text,
    });

  } catch (error: any) {
    console.error("FULL ERROR:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}