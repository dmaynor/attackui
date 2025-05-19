import { config } from 'dotenv';
config();

import '@/ai/flows/vulnerability-assessment-agent.ts';
import '@/ai/flows/flag-recognition-agent.ts';
import '@/ai/flows/reconnaissance-agent.ts';
import '@/ai/flows/learning-agent.ts';