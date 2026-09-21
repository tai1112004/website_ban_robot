export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient(
  path: string,
  options: RequestInit = {},
): Promise<unknown> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base)
    throw new ApiError("API_NOT_CONFIGURED", "API base URL is missing.");
  let response: Response;
  try {
    response = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("NETWORK_ERROR", "Unable to reach the service.");
  }
  if (response.status === 204 && response.ok) return undefined;
  const data: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const code =
      data &&
      typeof data === "object" &&
      "code" in data &&
      typeof data.code === "string"
        ? data.code
        : `HTTP_${response.status}`;
    throw new ApiError(code, "The request could not be completed.");
  }
  return data;
}
