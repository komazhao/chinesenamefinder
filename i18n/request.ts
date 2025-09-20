import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const allowedLocales = routing.locales as readonly string[];
  let locale = await requestLocale;

  // 兜底默认语言
  if (!locale || !allowedLocales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  // 兼容地区化中文代码
  if (["zh-CN", "zh-TW"].includes(locale)) {
    locale = "zh";
  }

  // 再次兜底到英文
  if (!allowedLocales.includes(locale)) {
    locale = "en";
  }

  try {
    const messages = (await import(`./messages/${locale.toLowerCase()}.json`))
      .default;
    return {
      locale,
      messages,
    };
  } catch (e) {
    return {
      locale: "en",
      messages: (await import(`./messages/en.json`)).default,
    };
  }
});
