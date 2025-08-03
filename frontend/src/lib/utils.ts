import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text);
  }
  // Fallback for older browsers
  const textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
  document.body.removeChild(textArea);
  return Promise.resolve();
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function getTheme(): 'light' | 'dark' | 'system' {
  if (typeof window === 'undefined') return 'system';
  return (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('theme', theme);

  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}