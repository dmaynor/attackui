import { config } from 'dotenv';
config();

// Original CTF Agents (some may be deprecated or repurposed by new agent structure)
import '@/ai/flows/vulnerability-assessment-agent.ts';
import '@/ai/flows/flag-recognition-agent.ts';
import '@/ai/flows/reconnaissance-agent.ts';
import '@/ai/flows/learning-agent.ts';

// General Purpose Agents
import '@/ai/flows/general-question-agent.ts';
import '@/ai/flows/technical-director-agent.ts';

// New Agent Team Structure
import '@/ai/flows/programmer-agent.ts';
import '@/ai/flows/qa-engineer-agent.ts';
import '@/ai/flows/network-engineer-agent.ts';
import '@/ai/flows/hardware-engineer-agent.ts';
import '@/ai/flows/architect-agent.ts';
import '@/ai/flows/critic-agent.ts';
import '@/ai/flows/game-master-agent.ts';
import '@/ai/flows/education-sme-agent.ts';
