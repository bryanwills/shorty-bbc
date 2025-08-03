'use client';

import { useState } from 'react';
import { Link, Copy, Trash2, RefreshCw, ExternalLink, Check } from 'lucide-react';
import { urlApi } from '@/lib/api';
import { Url } from '@/types';
import { formatDate, copyToClipboard, cn } from '@/lib/utils';

interface UrlListProps {
  urls: Url[];
  loading: boolean;
  error: string | null;
  onUrlDeleted: (shortCode: string) => void;
  onRefresh: () => void;
}

export function UrlList({ urls, loading, error, onUrlDeleted, onRefresh }: UrlListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleDelete = async (shortCode: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    setDeleting(shortCode);
    try {
      await urlApi.delete(shortCode);
      onUrlDeleted(shortCode);
    } catch (err) {
      console.error('Error deleting URL:', err);
      alert('Failed to delete URL');
    } finally {
      setDeleting(null);
    }
  };

  const handleCopy = async (text: string, shortCode: string) => {
    await copyToClipboard(text);
    setCopied(shortCode);
    setTimeout(() => setCopied(null), 2000);
  };

  const getShortUrl = (shortCode: string) => {
    return `http://localhost:3001/${shortCode}`;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Your URLs</h2>
          <p className="card-description">Manage your shortened URLs</p>
        </div>
        <div className="card-content">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="card-title">Your URLs</h2>
            <p className="card-description">
              {urls.length} shortened URL{urls.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={onRefresh}
            className="btn btn-secondary"
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="card-content">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
            {error}
          </div>
        )}

        {urls.length === 0 ? (
          <div className="text-center py-8">
            <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No URLs created yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first shortened URL above
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {urls.map((url) => (
              <div
                key={url.id}
                className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {url.short_code || url.shortCode}
                      </span>
                      {(url.is_custom || url.isCustom) && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          Custom
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground truncate mb-2">
                      {url.original_url || url.originalUrl}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Created {formatDate((url.createdAt || url.created_at) || new Date())}</span>
                      <span>by {url.created_by || 'admin'}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => {
                        const shortCode = url.short_code || url.shortCode;
                        if (shortCode) handleCopy(getShortUrl(shortCode), shortCode);
                      }}
                      className="p-2 hover:bg-accent rounded-md transition-colors"
                      title="Copy short URL"
                    >
                      {copied === (url.short_code || url.shortCode) ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>

                    <a
                      href={getShortUrl(url.short_code || url.shortCode || '')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-accent rounded-md transition-colors"
                      title="Open short URL"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>

                    <button
                      onClick={() => {
                        const shortCode = url.short_code || url.shortCode;
                        if (shortCode) handleDelete(shortCode);
                      }}
                      disabled={deleting === (url.short_code || url.shortCode)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                      title="Delete URL"
                    >
                      {deleting === (url.short_code || url.shortCode) ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}