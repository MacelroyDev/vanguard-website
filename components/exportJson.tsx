import { TradingCardProps } from './TradingCard';

// The subset of TradingCardProps that can be serialized to JSON
// (cardImage is excluded since base64 strings can be huge — handle separately)
export type CardData = Omit<TradingCardProps, 'imageX' | 'imageY' | 'imageZoom'> & {
  imageX: number;
  imageY: number;
  imageZoom: number;
  cardImage?: string; // optional — included but may be large
};

export function exportCardAsJson(cardData: CardData, cardName: string): void {
  const json = JSON.stringify(cardData, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${cardName.replace(/\s/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function importCardFromJson(
  file: File,
  onSuccess: (data: CardData) => void,
  onError?: (err: string) => void
): void {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target?.result as string) as CardData;

      // Basic validation — check a few required fields exist
      if (!parsed.name || !parsed.energy || !parsed.rarity) {
        throw new Error('Invalid card JSON: missing required fields.');
      }

      onSuccess(parsed);
    } catch (err) {
      onError?.(`Failed to import card: ${(err as Error).message}`);
    }
  };

  reader.onerror = () => onError?.('Failed to read file.');
  reader.readAsText(file);
}