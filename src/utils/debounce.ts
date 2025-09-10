export function debounce<F extends (...args: any[]) => any>(fn: F, delay: number) {
  let timeout: ReturnType<typeof setTimeout> | null
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
