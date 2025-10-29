export function formatSubtitle(distance?: string, address?: string): string {
  if (!distance && !address) {
    return '';
  }

  if (!distance && address) {
    return address;
  }

  return `${distance} • ${address}`;
}