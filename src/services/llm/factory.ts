import type { LLMProvider } from './types';
import { OpenAIService } from './OpenAIService';
import { GeminiService } from './GeminiService';

export class LLMServiceFactory {
    static getProvider(provider: 'openai' | 'gemini' | 'doubao'): LLMProvider {
        switch (provider) {
            case 'openai':
                return new OpenAIService();
            case 'gemini':
                return new GeminiService();
            // Add other providers here
            default:
                return new OpenAIService();
        }
    }
}
