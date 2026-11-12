import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { languages } from './languages';
import en from './locales/en.json';
import sr from './locales/sr.json';
import de from './locales/de.json';
import cs from './locales/cs.json';
import pl from './locales/pl.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ru from './locales/ru.json';
import uk from './locales/uk.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sr: { translation: sr },
      de: { translation: de },
      cs: { translation: cs },
      pl: { translation: pl },
      es: { translation: es },
      fr: { translation: fr },
      ru: { translation: ru },
      uk: { translation: uk },
    },
    supportedLngs: languages.map((l) => l.code),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;