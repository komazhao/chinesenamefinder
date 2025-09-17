"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Languages } from "lucide-react";
import { localeNames } from "@/i18n/locale";

interface LanguageSwitcherProps {
  isIcon?: boolean;
}

export default function LanguageSwitcher({ isIcon = false }: LanguageSwitcherProps) {
  const params = useParams();
  const locale = params.locale as string || 'en';
  const router = useRouter();
  const pathname = usePathname();

  const handleSwitchLanguage = (value: string) => {
    if (value !== locale) {
      let newPathName = pathname;

      // Remove current locale from pathname if it exists
      if (pathname.startsWith(`/${locale}`)) {
        newPathName = pathname.replace(`/${locale}`, '');
      }

      // Add new locale to pathname
      if (value !== 'en') {
        newPathName = `/${value}${newPathName}`;
      }

      // Ensure we have a valid path
      if (!newPathName || newPathName === '/') {
        newPathName = value !== 'en' ? `/${value}` : '/';
      }

      router.push(newPathName);
    }
  };

  return (
    <Select value={locale} onValueChange={handleSwitchLanguage}>
      <SelectTrigger className="flex items-center gap-2 border-none text-muted-foreground outline-none hover:bg-transparent focus:ring-0 focus:ring-offset-0 w-auto">
        <Languages className="h-4 w-4" />
        {!isIcon && (
          <span className="hidden md:block">{localeNames[locale]}</span>
        )}
      </SelectTrigger>
      <SelectContent className="z-50">
        {Object.entries(localeNames).map(([key, name]) => (
          <SelectItem
            className="cursor-pointer"
            key={key}
            value={key}
          >
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}