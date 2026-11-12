import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { countryCodes } from '../countries';

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}

export function CountrySelect({ value, onChange, placeholder, className = '' }: CountrySelectProps) {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? 'en';

  const options = useMemo(() => {
    const names = new Intl.DisplayNames([language], { type: 'region' });
    return countryCodes
      .map((code) => ({ code, name: names.of(code) ?? code }))
      .sort((a, b) => a.name.localeCompare(b.name, language));
  }, [language]);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-xl bg-neutral-900 outline-none ring-1 ring-neutral-800 focus:ring-neutral-600 ${
        value ? '' : 'text-neutral-500'
      } ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.code} value={option.code} className="bg-neutral-900 text-neutral-100">
          {option.name}
        </option>
      ))}
    </select>
  );
}