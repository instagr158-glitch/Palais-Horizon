import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getDictionary,
  isLocale,
  type Locale,
} from "./index";

/**
 * Resolve the active locale for a server render:
 * 1. explicit NEXT_LOCALE cookie (set by the language picker)
 * 2. otherwise English — everyone lands on English so the site is always
 *    understandable, then chooses their language from the gate / header.
 */
export async function getLocale(): Promise<Locale> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
}

/** True only when the visitor has actively chosen a language. */
export async function hasChosenLocale(): Promise<boolean> {
  const cookieLocale = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(cookieLocale);
}

export async function getServerDict() {
  return getDictionary(await getLocale());
}
