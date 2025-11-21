export const countryCodeMap: Record<string, string> = {
  'China': 'CN',
  'Germany': 'DE',
  'USA': 'US',
  'United States': 'US',
  'UK': 'GB',
  'United Kingdom': 'GB',
  'France': 'FR',
  'Italy': 'IT',
  'Spain': 'ES',
  'Canada': 'CA',
  'Australia': 'AU',
  'Japan': 'JP',
  'South Korea': 'KR',
  'India': 'IN',
  'Brazil': 'BR',
  'Mexico': 'MX',
  'Russia': 'RU',
  'Poland': 'PL',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Turkey': 'TR',
  'Ukraine': 'UA',
};

export function getCountryCode(countryName: string): string {
  const normalized = countryName.split(',')[0].trim();
  return countryCodeMap[normalized] || 'XX';
}

export function getCountryFlagEmoji(countryCode: string): string {
  if (countryCode === 'XX' || countryCode.length !== 2) return '🏳️';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
