export function parseTextList(value: string) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function formatTextList(value: string[] | undefined) {
  return (value ?? []).join('\n')
}
