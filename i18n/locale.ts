import { Pathnames } from "next-intl/routing";

export const locales = ["en", "zh"];

export const localeNames: Record<string, string> = {
  en: "English",
  zh: "中文",
};

export const defaultLocale = "en";

export const localePrefix = "as-needed";

export const localeDetection =
  process.env.NEXT_PUBLIC_LOCALE_DETECTION === "true";

export const pathnames: Pathnames<typeof locales> = {};
