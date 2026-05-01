type FetchOptions<T> = RequestInit & {
  revalidate?: number;
  tags?: string[];
  fallbackData?: T;
  suppressError?: boolean;
};

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export async function fetchFromApi<T>(path: string, options: FetchOptions<T> = {}) {
  const baseUrl = getBaseUrl();
  const url = new URL(path, baseUrl).toString();

  const { revalidate, tags, headers, fallbackData, suppressError, ...init } =
    options;

  type AugmentedRequestInit = RequestInit & {
    next?: {
      revalidate?: number | false;
      tags?: string[];
    };
  };

  const requestInit: AugmentedRequestInit = {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    },
  };

  if (revalidate !== undefined || (tags && tags.length)) {
    requestInit.next = {
      revalidate,
      tags,
    };

    if (requestInit.cache === undefined) {
      requestInit.cache = "force-cache";
    }
  }

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    if (response.status === 404 && fallbackData !== undefined) {
      return fallbackData;
    }

    const payload = await safeJson(response);
    const errorMessage =
      (payload && (payload.message || payload.error)) ||
      `Failed to fetch ${path}: ${response.status}`;

    if (suppressError && fallbackData !== undefined) {
      console.warn(errorMessage);
      return fallbackData;
    }

    throw new Error(errorMessage);
  }

  const json = await response.json();
  return (json.data ?? json) as T;
}

async function safeJson(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}
