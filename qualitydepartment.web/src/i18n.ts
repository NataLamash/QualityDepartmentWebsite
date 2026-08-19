// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import uk from './locales/uk.json';
import en from './locales/en.json';

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      uk: { translation: uk },
      en: { translation: en }
    },
    lng: localStorage.getItem('language') || 'uk',           
    fallbackLng: 'uk',
    fallbackNS: 'translation',
    ns: 'translation',
    defaultNS: 'translation',
    interpolation: {
      escapeValue: false   
    }
  });

// Зберігати вибір мови в localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('language', lng);
});

export default i18n;
