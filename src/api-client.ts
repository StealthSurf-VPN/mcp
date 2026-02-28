export interface ApiClientOptions {
  baseUrl: string
  apiKey: string
}

/**
 * Creates a thin HTTP client for the StealthSurf API.
 * Handles auth header injection, JSON serialization, response envelope
 * unwrapping (`{ status, data }` → `data`), and error extraction.
 *
 * @param options - API base URL and `stlth_*` API key
 * @returns Object with `get`, `post`, `patch`, `put`, `delete` methods
 */
export const createApiClient = (options: ApiClientOptions) => {
  const { baseUrl, apiKey } = options

  const request = async <T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string | number | undefined>,
  ): Promise<T> => {
    const url = new URL(path, baseUrl)

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value))
      }
    }

    const response = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    const json = (await response.json()) as {
      status: boolean
      statusCode?: number
      data?: T
      errorCode?: number
      message?: string
    }

    if (!json.status)
      throw new Error(`API Error [${json.errorCode}]: ${json.message}`)

    return json.data as T
  }

  return {
    /** Send a GET request with optional query parameters. */
    get: <T = unknown>(
      path: string,
      query?: Record<string, string | number | undefined>,
    ) => request<T>("GET", path, undefined, query),

    /** Send a POST request with optional JSON body. */
    post: <T = unknown>(path: string, body?: unknown) =>
      request<T>("POST", path, body),

    /** Send a PATCH request with optional JSON body. */
    patch: <T = unknown>(path: string, body?: unknown) =>
      request<T>("PATCH", path, body),

    /** Send a PUT request with optional JSON body. */
    put: <T = unknown>(path: string, body?: unknown) =>
      request<T>("PUT", path, body),

    /** Send a DELETE request with optional JSON body. */
    delete: <T = unknown>(path: string, body?: unknown) =>
      request<T>("DELETE", path, body),
  }
}

export type ApiClient = ReturnType<typeof createApiClient>
