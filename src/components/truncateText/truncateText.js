export default function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text
  }
  let truncatedText = text.slice(0, maxLength)
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')
  if (lastSpaceIndex > 0) {
    truncatedText = truncatedText.slice(0, lastSpaceIndex)
  }
  return `${truncatedText}...`
}
