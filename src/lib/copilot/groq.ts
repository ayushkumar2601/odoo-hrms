import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "", 
});

export const MODEL_ID = "llama3-8b-8192";
