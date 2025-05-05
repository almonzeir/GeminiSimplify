import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {defineFlow} from '@genkit-ai/flow';
import {z} from 'zod';

import {createHandler} from '@genkit-ai/next/server';

import '@/ai/flows/explain-simplification.ts';
import '@/ai/flows/suggest-input-text.ts';
import '@/ai/flows/simplify-and-translate.ts';

export const handler = createHandler();
