/**
 * Default timeout for outgoing requests to remote websites
 */
export const REMOTE_FETCH_TIMEOUT_MS = 10_000

/**
 * Fetch a remote URL with a timeout, so hanging servers
 * can't keep sockets and memory around indefinitely
 */
export function fetchWithTimeout(
    url: string,
    init: RequestInit = {},
    timeoutMs: number = REMOTE_FETCH_TIMEOUT_MS
): Promise<Response> {
    return fetch(url, {
        redirect: "follow",
        ...init,
        signal: AbortSignal.timeout(timeoutMs),
    })
}

/**
 * Read a response body up to a maximum number of bytes
 *
 * If `truncate` is set, reading stops once the limit is reached and the
 * data read so far is returned, otherwise an error is thrown. In both
 * cases the rest of the body is never buffered in memory.
 */
export async function readBodyWithLimit(
    response: Response,
    maxBytes: number,
    { truncate = false }: { truncate?: boolean } = {}
): Promise<Buffer> {
    const contentLength = Number(response.headers.get("content-length"))
    if (!truncate && contentLength > maxBytes) {
        await response.body?.cancel()
        throw new Error(`Response body exceeds ${maxBytes} bytes`)
    }

    if (!response.body) {
        return Buffer.alloc(0)
    }

    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let total = 0

    while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const remaining = maxBytes - total
        if (value.byteLength > remaining) {
            await reader.cancel()
            if (!truncate) {
                throw new Error(`Response body exceeds ${maxBytes} bytes`)
            }
            chunks.push(value.subarray(0, remaining))
            total += remaining
            break
        }

        chunks.push(value)
        total += value.byteLength
    }

    return Buffer.concat(chunks, total)
}
