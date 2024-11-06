export function displayAmount(value: number): string {
  return typeof value !== 'number' ? value : value.toFixed(2)
}
