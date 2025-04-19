'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting disposal instructions based on waste classification.
 *
 * The flow takes an image URL as input, classifies the waste type using AI, and provides tailored disposal instructions.
 *
 * - suggestDisposalInstructions - An async function that takes an image URL and returns disposal instructions.
 * - SuggestDisposalInstructionsInput - The input type for the suggestDisposalInstructions function.
 * - SuggestDisposalInstructionsOutput - The return type for the suggestDisposalInstructions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestDisposalInstructionsInputSchema = z.object({
  imageUrl: z.string().describe('The URL of the waste image.'),
});
export type SuggestDisposalInstructionsInput = z.infer<typeof SuggestDisposalInstructionsInputSchema>;

const SuggestDisposalInstructionsOutputSchema = z.object({
  wasteType: z.string().describe('The classified type of waste (e.g., Organic, Recyclable, Hazardous).'),
  disposalInstructions: z.string().describe('Tailored instructions for proper disposal of the waste.'),
});
export type SuggestDisposalInstructionsOutput = z.infer<typeof SuggestDisposalInstructionsOutputSchema>;

export async function suggestDisposalInstructions(input: SuggestDisposalInstructionsInput): Promise<SuggestDisposalInstructionsOutput> {
  return suggestDisposalInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDisposalInstructionsPrompt',
  input: {
    schema: z.object({
      imageUrl: z.string().describe('The URL of the waste image.'),
    }),
  },
  output: {
    schema: z.object({
      wasteType: z.string().describe('The classified type of waste (e.g., Organic, Recyclable, Hazardous).'),
      disposalInstructions: z.string().describe('Tailored instructions for proper disposal of the waste.'),
    }),
  },
  prompt: `You are an AI assistant specializing in waste disposal.

  Given an image of waste, classify the waste type (Organic, Recyclable, Hazardous) and provide tailored disposal instructions.

  Image URL: {{imageUrl}}

  Respond with the waste type and disposal instructions.
  Ensure the waste type and disposal instructions are specific and helpful for the user.
  `,
});

const suggestDisposalInstructionsFlow = ai.defineFlow<
  typeof SuggestDisposalInstructionsInputSchema,
  typeof SuggestDisposalInstructionsOutputSchema
>({
  name: 'suggestDisposalInstructionsFlow',
  inputSchema: SuggestDisposalInstructionsInputSchema,
  outputSchema: SuggestDisposalInstructionsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
