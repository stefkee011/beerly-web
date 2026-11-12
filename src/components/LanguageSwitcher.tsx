import { useTranslation } from 'react-i18next';
import { languages } from '../languages';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <select
      value={i18n.resolvedLanguage}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
      aria-label="Language"
      className="rounded-lg bg-neutral-900 px-2 py-1.5 text-neutral-400 outline-none ring-1 ring-neutral-800 hover:text-neutral-100"
    >
      {languages.map((language) => (
        <option key={language.code} value={language.code} className="bg-neutral-900 text-neutral-100">
          {language.label}
        </option>
      ))}
    </select>
  );
}