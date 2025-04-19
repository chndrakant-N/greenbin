'use server';
/**
 * @fileOverview Classifies waste into categories (Organic, Recyclable, Hazardous) using AI.
 *
 * - classifyWaste - A function that classifies waste based on an image.
 * - ClassifyWasteInput - The input type for the classifyWaste function.
 * - ClassifyWasteOutput - The return type for the classifyWaste function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ClassifyWasteInputSchema = z.object({
  photoUrl: z.string().describe('The URL of the waste photo.'),
});
export type ClassifyWasteInput = z.infer<typeof ClassifyWasteInputSchema>;

const ClassifyWasteOutputSchema = z.object({
  wasteType: z
    .enum(['Organic', 'Recyclable', 'Hazardous'])
    .describe('The type of waste.'),
  disposalInstructions: z
    .string()
    .describe('Instructions on how to properly dispose of the waste.'),
});
export type ClassifyWasteOutput = z.infer<typeof ClassifyWasteOutputSchema>;

export async function classifyWaste(input: ClassifyWasteInput): Promise<ClassifyWasteOutput> {
  return classifyWasteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyWastePrompt',
  input: {
    schema: z.object({
      photoUrl: z.string().describe('The URL of the waste photo.'),
    }),
  },
  output: {
    schema: z.object({
      wasteType: z
        .enum(['Organic', 'Recyclable', 'Hazardous'])
        .describe('The type of waste.'),
      disposalInstructions: z
        .string()
        .describe('Instructions on how to properly dispose of the waste.'),
    }),
  },
  prompt: `You are an AI assistant specialized in waste classification.

  Based on the image provided, classify the waste into one of the following categories: Organic, Recyclable, or Hazardous.
  Also, provide brief instructions on how to properly dispose of the waste.

  Photo: {{media url=photoUrl}}
  Response:
  `,
});

const classifyWasteFlow = ai.defineFlow<
  typeof ClassifyWasteInputSchema,
  typeof ClassifyWasteOutputSchema
>(
  {
    name: 'classifyWasteFlow',
    inputSchema: ClassifyWasteInputSchema,
    outputSchema: ClassifyWasteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
