import OpenAI from "openai";
import { env } from "@/env";

export const xai = new OpenAI({
  apiKey: env.XAI_API_KEY,
  baseURL: "https://api.x.ai/v1",
});
