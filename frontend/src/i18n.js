import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import es from './locales/es.json';

// Obtener idioma guardado o usar español como defecto
const savedLanguage = localStorage.getItem('preferred-language') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es }
    },
    lng: savedLanguage, // usar idioma guardado
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;