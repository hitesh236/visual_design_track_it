'use server';
/**
 * @fileOverview A Genkit flow for generating fresh, concise page content.
 *
 * - generatePageContent - A function that generates concise page content like a welcome message, a short quote, or a daily affirmation.
 * - GeneratePageContentInput - The input type for the generatePageContent function.
 * - GeneratePageContentOutput - The return type for the generatePageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePageContentInputSchema = z.void();
export type GeneratePageContentInput = z.infer<typeof GeneratePageContentInputSchema>;

const GeneratePageContentOutputSchema = z.object({
  content: z.string().describe('A concise piece of content like a welcome message, a short quote, or a daily affirmation.'),
});
export type GeneratePageContentOutput = z.infer<typeof GeneratePageContentOutputSchema>;

const pageContentPrompt = ai.definePrompt({
  name: 'pageContentPrompt',
  input: {schema: GeneratePageContentInputSchema},
  output: {schema: GeneratePageContentOutputSchema},
  prompt: `Generate a fresh, concise piece of content suitable for a web page. This could be a warm welcome message, an inspiring short quote, or a positive daily affirmation. Ensure it is unique and engaging. Make it no longer than 30 words.`,
});

const generatePageContentFlow = ai.defineFlow(
  {
    name: 'generatePageContentFlow',
    inputSchema: GeneratePageContentInputSchema,
    outputSchema: GeneratePageContentOutputSchema,
  },
  async () => {
    const {output} = await pageContentPrompt();
    return output!;
  }
);

/**
 * Generates page content using AI with a graceful fallback if the service is unavailable.
 */
export async function generatePageContent(): Promise<GeneratePageContentOutput> {
  try {
    return await generatePageContentFlow();
  } catch (error) {
    // Return a calm, minimalist fallback message if AI generation fails (e.g., missing API key)
    return {
      content: "Simplicity is the ultimate sophistication. Welcome to your minimalist space for quiet reflection."
    };
  }
}
