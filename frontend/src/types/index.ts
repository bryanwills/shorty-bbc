export interface Url {
  id?: number;
  short_code?: string;
  shortCode?: string;
  original_url?: string;
  originalUrl?: string;
  created_at?: string;
  createdAt?: string;
  created_by?: string;
  is_custom?: boolean;
  isCustom?: boolean;
}

export interface CreateUrlRequest {
  originalUrl: string;
  customCode?: string;
}

export interface CreateUrlResponse {
  success: boolean;
  data: {
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
  };
}

export interface UrlListResponse {
  success: boolean;
  data: Url[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface UrlResponse {
  success: boolean;
  data: {
    shortCode: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
    isCustom: boolean;
  };
}

export interface DeleteUrlResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  error: string;
}

export interface Theme {
  theme: 'light' | 'dark' | 'system';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}