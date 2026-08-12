/** Decode HTML entities returned by the Open Trivia Database API. */
export function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea')
  textarea.innerHTML = text
  return textarea.value
}
