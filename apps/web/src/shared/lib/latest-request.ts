/** Устаревшие ответы игнорируются. */
export function latestRequest() {
  let controller: AbortController | undefined
  let version = 0

  return {
    start() {
      controller?.abort()
      controller = new AbortController()
      const current = ++version

      return { signal: controller.signal, isCurrent: () => current === version }
    },
    cancel() {
      version++
      controller?.abort()
    }
  }
}
