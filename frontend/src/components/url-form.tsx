'use client';

import { useState } from 'react';
import { Link, Copy, Check } from 'lucide-react';
import { urlApi } from '@/lib/api';
import { validateUrl, copyToClipboard, cn } from '@/lib/utils';

interface UrlFormProps {
  onUrlCreated: (url: any) => void;
}

export function UrlForm({ onUrlCreated }: UrlFormProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!originalUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await urlApi.create({
        originalUrl: originalUrl.trim(),
        customCode: customCode.trim() || undefined,
      });

      setSuccess('URL shortened successfully!');
      setOriginalUrl('');
      setCustomCode('');
      onUrlCreated(response.data);

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create shortened URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Create Short URL</h2>
        <p className="card-description">
          Enter a long URL and get a short, shareable link
        </p>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              Original URL
            </label>
            <input
              id="url"
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="input"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="customCode" className="block text-sm font-medium mb-2">
              Custom Code (Optional)
            </label>
            <input
              id="customCode"
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="my-custom-link"
              className="input"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for auto-generated code
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !originalUrl.trim()}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating...' : 'Create Short URL'}
          </button>
        </form>
      </div>
    </div>
  );
}