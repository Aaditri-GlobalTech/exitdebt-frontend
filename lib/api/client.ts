/* ─── HTTP Client with Error Handling & Mock Fallback ────────────────────── */

import { API_CONFIG, isBackendMode } from "./config";

/* ─── Error Types ────────────────────────────────────────────────────────── */

export type ApiErrorCode =
    | "NETWORK_ERROR"
    | "TIMEOUT"
    | "VALIDATION_ERROR"
    | "AUTH_ERROR"
    | "NOT_FOUND"
    | "SERVER_ERROR"
    | "UNKNOWN";

export class ApiError extends Error {
    constructor(
        public code: ApiErrorCode,
        message: string,
        public status?: number,
        public details?: Record<string, unknown>
    ) {
        super(message);
        this.name = "ApiError";
    }
}

/* ─── Request Configuration ──────────────────────────────────────────────── */

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
    timeout?: number;
}

const DEFAULT_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1_000;

/* ─── Core Fetch Wrapper ─────────────────────────────────────────────────── */

/**
 * Makes an HTTP request to the backend API.
 *
 * Features:
 * - Automatic JSON serialization/deserialization
 * - Timeout support via AbortController
 * - Automatic retry with exponential backoff for 5xx errors
 * - Structured error types for consistent error handling
 *
 * @throws {ApiError} on any failure
 */
export async function apiRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const {
        method = "GET",
        body,
        headers = {},
        timeout = DEFAULT_TIMEOUT_MS,
    } = options;

    const url = `${API_CONFIG.apiUrl}${endpoint}`;

    const fetchOptions: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
    };

    if (body && method !== "GET") {
        fetchOptions.body = JSON.stringify(body);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        fetchOptions.signal = controller.signal;

        try {
            const response = await fetch(url, fetchOptions);
            clearTimeout(timeoutId);

            if (response.ok) {
                return (await response.json()) as T;
            }

            // Don't retry client errors (4xx)
            if (response.status >= 400 && response.status < 500) {
                const errorBody = await response
                    .json()
                    .catch(() => ({}));
                throw new ApiError(
                    response.status === 401 || response.status === 403
                        ? "AUTH_ERROR"
                        : response.status === 404
                            ? "NOT_FOUND"
                            : "VALIDATION_ERROR",
                    errorBody.detail ||
                        errorBody.error ||
                        errorBody.message ||
                        `Request failed with status ${response.status}`,
                    response.status,
                    errorBody
                );
            }

            // Server error (5xx) — retry
            lastError = new ApiError(
                "SERVER_ERROR",
                `Server error: ${response.status}`,
                response.status
            );
        } catch (err) {
            clearTimeout(timeoutId);

            if (err instanceof ApiError) throw err;

            if (err instanceof DOMException && err.name === "AbortError") {
                lastError = new ApiError(
                    "TIMEOUT",
                    `Request timed out after ${timeout}ms`
                );
            } else {
                lastError = new ApiError(
                    "NETWORK_ERROR",
                    err instanceof Error
                        ? err.message
                        : "Network request failed"
                );
            }
        }

        // Wait before retrying (exponential backoff)
        if (attempt < MAX_RETRIES) {
            await new Promise((r) =>
                setTimeout(r, RETRY_DELAY_MS * Math.pow(2, attempt))
            );
        }
    }

    throw lastError || new ApiError("UNKNOWN", "Request failed");
}

/* ─── Backend Health Check ───────────────────────────────────────────────── */

let _backendAvailable: boolean | null = null;

/**
 * Check if the backend is reachable.
 * Caches the result for the session to avoid repeated probes.
 * Use `resetBackendStatus()` to force a re-check.
 */
export async function checkBackendHealth(): Promise<boolean> {
    if (!isBackendMode()) return false;
    if (_backendAvailable !== null) return _backendAvailable;

    try {
        await apiRequest<{ status: string }>("/api/health", {
            timeout: 5_000,
        });
        _backendAvailable = true;
    } catch {
        _backendAvailable = false;
        console.warn(
            "[ExitDebt] Backend unreachable — falling back to mock data."
        );
    }

    return _backendAvailable;
}

/** Reset the cached backend availability status. */
export function resetBackendStatus(): void {
    _backendAvailable = null;
}

/** Returns the cached backend availability status without making a request. */
export function isBackendAvailable(): boolean {
    return _backendAvailable === true;
}
