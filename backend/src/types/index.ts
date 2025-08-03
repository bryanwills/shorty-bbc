export interface Url {
  id: number;
  short_code: string;
  original_url: string;
  created_at: Date;
  created_by: string;
  is_custom: boolean;
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
    createdAt: Date;
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
    createdAt: Date;
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

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: Date;
}

export interface Analytics {
  id: number;
  url_id: number;
  ip_address: string;
  user_agent: string;
  referrer: string;
  country: string;
  city: string;
  clicked_at: Date;
}

export interface RequestWithUser extends Request {
  user?: {
    id: number;
    username: string;
  };
}