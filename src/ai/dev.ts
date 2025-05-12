import { config } from 'dotenv';
config();

import '@/ai/flows/generate-blog-post.ts';
import '@/ai/flows/summarize-user-feedback.ts';
import '@/ai/flows/research-blog-topic.ts';