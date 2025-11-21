import * as Flags from 'country-flag-icons/react/3x2';
import { getCountryCode } from '@/utils/countries';

interface CountryFlagProps {
  countryName: string;
  className?: string;
}

export function CountryFlag({ countryName, className = "w-6 h-4" }: CountryFlagProps) {
  const code = getCountryCode(countryName);
  
  const FlagComponent = Flags[code as keyof typeof Flags] as React.ComponentType<{ className?: string }>;
  
  if (!FlagComponent || code === 'XX') {
    return <span className="text-sm opacity-50">🏳️</span>;
  }
  
  return <FlagComponent className={className} title={countryName} />;
}
