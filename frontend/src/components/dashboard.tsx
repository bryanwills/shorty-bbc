'use client';

import { useState, useEffect } from 'react';
import { UrlForm } from './url-form';
import { UrlList } from './url-list';
import { ThemeToggle } from './theme-toggle';
import { urlApi } from '@/lib/api';
import { Url } from '@/types';

export function Dashboard() {
  const [urls, setUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      const response = await urlApi.getAll();
      setUrls(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load URLs');
      console.error('Error fetching URLs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = (newUrl: any) => {
    // Transform the API response to match our URL structure
    const transformedUrl = {
      id: Date.now(), // Use timestamp as ID since we don't have one
      short_code: newUrl.shortCode,
      original_url: newUrl.originalUrl,
      created_at: newUrl.createdAt,
      created_by: 'admin',
      is_custom: false, // We'll need to track this separately
    };
    setUrls(prev => [transformedUrl, ...prev]);
  };

  const handleUrlDeleted = (shortCode: string) => {
    setUrls(prev => prev.filter(url => (url.short_code || url.shortCode) !== shortCode));
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Shorty</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your shortened URLs
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <UrlForm onUrlCreated={handleUrlCreated} />
        </div>

        <div className="space-y-6">
          <UrlList
            urls={urls}
            loading={loading}
            error={error}
            onUrlDeleted={handleUrlDeleted}
            onRefresh={fetchUrls}
          />
        </div>
      </div>
    </div>
  );
}