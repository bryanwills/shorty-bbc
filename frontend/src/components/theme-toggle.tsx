'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from './theme-provider';
import { cn } from '@/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 rounded-lg border bg-card p-1">
      <button
        onClick={() => setTheme('light')}
        className={cn(
          'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          theme === 'light'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Sun className="h-4 w-4" />
        <span className="hidden sm:inline">Light</span>
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={cn(
          'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          theme === 'dark'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Moon className="h-4 w-4" />
        <span className="hidden sm:inline">Dark</span>
      </button>

      <button
        onClick={() => setTheme('system')}
        className={cn(
          'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
          theme === 'system'
            ? 'bg-primary text-primary-foreground'
            : 'hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <Monitor className="h-4 w-4" />
        <span className="hidden sm:inline">System</span>
      </button>
    </div>
  );
}