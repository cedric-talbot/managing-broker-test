import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import partiesPage from "./locales/en/quotations/partiesPage.json";

const resources = {
  en: {
    partiesPage,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  debug: true,
  interpolation: {
    // react already safes from xss
    escapeValue: false,
  },
});

export default i18n;
