export function calculateReadingTime(html: string | null | undefined): number {
  if (!html) return 1
  const plainText = html.replace(/<[^>]*>/g, ' ')
  const words = plainText.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return 1
  return Math.max(1, Math.ceil(words.length / 200))
}
