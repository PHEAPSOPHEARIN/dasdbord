// HTTP Request Handler
// Centralized request management with authentication and error handling

import { 
  API_URL, 
  STORAGE_KEYS, 
  HTTP_STATUS, 
  ERROR_MESSAGES 
} from "./config";

/**
 * Request options interface
 */
export interface RequestOptions extends RequestInit {
  timeout?: number;
  requiresAuth?: boolean;
  baseURL?: string;
}

/**
 * API Response interface
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * API Error class
 */
export class ApiError extends Error {
  status: number;
  data?: any;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.errors = data?.errors;
  }
}

/**
 * Get authentication token from localStorage
 */
function getAuthToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
}

/**
 * Clear authentication data
 */
function clearAuthData(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
}

/**
 * Redirect to login page
 */
function redirectToLogin(): void {
  // Clear auth data first
  clearAuthData();
  // Redirect to login
  window.location.href = "/login";
}

/**
 * Request with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {}
): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new ApiError(ERROR_MESSAGES.TIMEOUT, 408);
    }
    throw error;
  }
}

/**
 * Parse response body based on content type
 */
async function parseResponse(response: Response): Promise<any> {
  const contentType = response.headers.get("content-type");
  
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  if (contentType && contentType.includes("text/")) {
    return response.text();
  }
  
  if (contentType && contentType.includes("application/pdf")) {
    return response.blob();
  }
  
  // Try JSON first, fallback to text
  try {
    return await response.json();
  } catch {
    return response.text();
  }
}

/**
 * Build request headers
 */
function buildHeaders(requiresAuth: boolean, customHeaders?: HeadersInit): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add custom headers
  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  // Add authentication token if required
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      // No token available but auth is required
      throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);
    }
  }

  return headers;
}

/**
 * Main request function
 */
export async function request<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    requiresAuth = true,
    baseURL = API_URL,
    headers = {},
    ...restOptions
  } = options;

  // Build full URL
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  // Build headers
  const requestHeaders = buildHeaders(requiresAuth, headers);

  try {
    // Make the request
    const response = await fetchWithTimeout(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    // Parse response
    const data = await parseResponse(response);

    // Handle unauthorized (401)
    if (response.status === HTTP_STATUS.UNAUTHORIZED) {
      redirectToLogin();
      throw new ApiError(ERROR_MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED, data);
    }

    // Handle forbidden (403)
    if (response.status === HTTP_STATUS.FORBIDDEN) {
      throw new ApiError(ERROR_MESSAGES.FORBIDDEN, HTTP_STATUS.FORBIDDEN, data);
    }

    // Handle not found (404)
    if (response.status === HTTP_STATUS.NOT_FOUND) {
      throw new ApiError(ERROR_MESSAGES.NOT_FOUND, HTTP_STATUS.NOT_FOUND, data);
    }

    // Handle validation errors (422)
    if (response.status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
      throw new ApiError(
        data.message || ERROR_MESSAGES.VALIDATION_ERROR,
        HTTP_STATUS.UNPROCESSABLE_ENTITY,
        data
      );
    }

    // Handle server errors (500+)
    if (response.status >= 500) {
      throw new ApiError(ERROR_MESSAGES.SERVER_ERROR, response.status, data);
    }

    // Check if request was successful
    if (!response.ok) {
      throw new ApiError(
        data.message || `HTTP ${response.status}`,
        response.status,
        data
      );
    }

    // Return successful response
    return {
      data: data.data !== undefined ? data.data : data,
      message: data.message,
      success: true,
      status: response.status,
      errors: data.errors,
    };
  } catch (error: any) {
    // Handle ApiError
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors
    if (error.message === "Failed to fetch") {
      throw new ApiError(ERROR_MESSAGES.NETWORK_ERROR, 0, error);
    }

    // Generic error
    throw new ApiError(
      error.message || ERROR_MESSAGES.UNKNOWN,
      0,
      error
    );
  }
}

/**
 * HTTP GET request
 */
export async function get<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "GET",
  });
}

/**
 * HTTP POST request
 */
export async function post<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * HTTP PUT request
 */
export async function put<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * HTTP PATCH request
 */
export async function patch<T = any>(
  endpoint: string,
  body?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "PATCH",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * HTTP DELETE request
 */
export async function del<T = any>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "DELETE",
  });
}

/**
 * Upload file with FormData
 */
export async function uploadFile<T = any>(
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  const formData = new FormData();
  formData.append("file", file);

  // Add additional form data if provided
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  const { requiresAuth = true, baseURL = API_URL, headers = {} } = options || {};
  
  const token = getAuthToken();
  const url = endpoint.startsWith("http") 
    ? endpoint 
    : `${baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const requestHeaders: Record<string, string> = {};

  // Add custom headers (but don't set Content-Type for FormData)
  if (headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        if (key.toLowerCase() !== 'content-type') {
          requestHeaders[key] = value;
        }
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-type') {
          requestHeaders[key] = value;
        }
      });
    } else {
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== 'content-type') {
          requestHeaders[key] = value;
        }
      });
    }
  }

  if (requiresAuth && token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers: requestHeaders,
      body: formData,
      ...options,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      throw new ApiError(
        data.message || "Upload failed",
        response.status,
        data
      );
    }

    return {
      data: data.data || data,
      message: data.message,
      success: true,
      status: response.status,
    };
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(error.message || "Upload failed", 0, error);
  }
}

/**
 * Download file
 */
export async function downloadFile(
  endpoint: string,
  filename?: string,
  options?: RequestOptions
): Promise<void> {
  try {
    const response = await request<Blob>(endpoint, {
      ...options,
      headers: {
        ...options?.headers,
      },
    });

    // Create blob URL
    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);

    // Create temporary link and trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error;
  }
}

/**
 * Batch requests (parallel)
 */
export async function batchRequest<T = any>(
  requests: Array<() => Promise<ApiResponse<any>>>
): Promise<ApiResponse<T>[]> {
  try {
    return await Promise.all(requests.map((req) => req()));
  } catch (error) {
    throw error;
  }
}

/**
 * Sequential requests (one after another)
 */
export async function sequentialRequest<T = any>(
  requests: Array<() => Promise<ApiResponse<any>>>
): Promise<ApiResponse<T>[]> {
  const results: ApiResponse<T>[] = [];
  
  for (const req of requests) {
    try {
      const result = await req();
      results.push(result);
    } catch (error) {
      throw error;
    }
  }
  
  return results;
}

/**
 * Retry request with exponential backoff
 */
export async function retryRequest<T = any>(
  requestFn: () => Promise<ApiResponse<T>>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<ApiResponse<T>> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on client errors (4xx)
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait with exponential backoff
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}