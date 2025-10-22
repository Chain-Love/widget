interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('Content-Type');

  if (!response.ok) {
    let errorMessage = 'Fetch request failed';

    if (contentType?.includes('application/json')) {
      const errorData = await response.json();

      errorMessage = errorData.error.message || errorData.error || errorMessage;
    } else {
      const errorText = await response.text();

      errorMessage = errorText || response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  if (contentType?.includes('application/json')) {
    return response.json();
  }

  return response.text() as unknown as T;
};

const fetchClient = {
  get: async <T = unknown>(
    url: string,
    options: FetchOptions = {},
  ): Promise<T> => {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    return handleResponse<T>(response);
  },

  post: async <T = unknown, B = unknown>(
    url: string,
    data?: B,
    options: FetchOptions = {},
  ): Promise<T> => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  put: async <T = unknown, B = unknown>(
    url: string,
    data?: B,
    options: FetchOptions = {},
  ): Promise<T> => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  delete: async <T = unknown, B = unknown>(
    url: string,
    data?: B,
    options: FetchOptions = {},
  ): Promise<T> => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },

  patch: async <T = unknown, B = unknown>(
    url: string,
    data?: B,
    options: FetchOptions = {},
  ): Promise<T> => {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    return handleResponse<T>(response);
  },
};

export default fetchClient;
