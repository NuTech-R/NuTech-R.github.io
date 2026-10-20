// Japanese is the default language (served at /), English lives under /en.
import { getPermalink, trimSlash } from './utils/permalinks';

export type Lang = 'ja' | 'en';

/** Text in both languages, picked with `pick()`. */
export type Bilingual<T = string> = Record<Lang, T>;

export const pick = <T>(value: Bilingual<T>, lang: Lang): T => value[lang];

export const getLang = (url: URL): Lang => (trimSlash(url.pathname).split('/')[0] === 'en' ? 'en' : 'ja');

/** Path of the page without the language prefix: `/en/robots` -> `/robots`. */
export const stripLang = (pathname: string): string => {
  const parts = trimSlash(pathname).split('/').filter(Boolean);
  if (parts[0] === 'en') parts.shift();
  return '/' + parts.join('/');
};

/** Permalink of `path` (written without a language prefix) in the given language. */
export const localize = (path: string, lang: Lang): string => {
  if (path.startsWith('http') || path.startsWith('#')) return path;
  const [pathname, hash] = path.split('#');
  const prefixed = lang === 'en' ? `/en${pathname === '/' ? '' : pathname}` : pathname;
  return getPermalink(prefixed || '/') + (hash ? `#${hash}` : '');
};
