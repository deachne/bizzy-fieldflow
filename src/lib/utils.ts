import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// API Key Management
export const PERPLEXITY_API_KEY = 'bizzy_perplexity_api_key';

export const getPerplexityApiKey = (): string => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(PERPLEXITY_API_KEY) || '';
};

export const setPerplexityApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERPLEXITY_API_KEY, key);
};
