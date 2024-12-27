import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { fr } from "vuetify/locale";

const customFr = {
  ...fr,
  datePicker: {
    title: "Choisissez une date",
    header: "Sélectionnez deux dates",
    itemsSelected: "{0} dates sélectionnées",
    nextMonth: "Mois suivant",
    prevMonth: "Mois précédent",
    nextYear: "Année suivante",
    prevYear: "Année précédente",
  },
};

export const vuetify = createVuetify({
  locale: {
    locale: "fr",
    fallback: "en",
    messages: { fr: customFr },
  },
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          surface: "#212121",
          primary: "#03a9f4",
        },
      },
      light: {
        dark: false,
        colors: {
          background: "#ffffff",
          surface: "#f5f5f5",
          primary: "#6200ea",
        },
      },
    },
  },
});

export default vuetify;
