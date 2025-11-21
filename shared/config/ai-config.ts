import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Define the model name to be used consistently
export const geminiModel = 'gemini-2.5-flash';

/**
 * Returns an authenticated Google AI provider instance.
 * It reads the API key from the environment variable GOOGLE_GENERATIVE_AI_API_KEY.
 */
export const getGoogleProvider = () => {
  const google = createGoogleGenerativeAI({
    // apiKey: is read from process.env.GOOGLE_GENERATIVE_AI_API_KEY
  });
  return google;
};
