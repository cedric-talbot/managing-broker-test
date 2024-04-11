import "react-i18next";

import partiesPage from "../i18n/locales/en/quotations/partiesPage.json";

declare module "react-i18next" {
  interface CustomTypeOptions {
    resources: {
      partiesPage: typeof partiesPage;
    };
  }
}
