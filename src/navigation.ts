import { localize, type Lang } from './i18n';

export const GITHUB_URL = 'https://github.com/NuTech-R';
export const ZENN_PUBLICATION_URL = 'https://zenn.dev/p/nutechr';
export const YOUTUBE_SEEK_URL = 'https://www.youtube.com/watch?v=Hudw18oglWg';
export const CONTACT_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSepabyDR055HVkLUhzj5XtbqV4RzWfwHWocCNPA0eITaLjBmg/viewform';
export const NEXIS_R_URL = 'https://nexisr2016.wixsite.com/benri-robot';

const MENU = {
  ja: { robots: 'ロボット', results: '大会結果', tech: '技術紹介', contact: 'お問い合わせ' },
  en: { robots: 'Robot', results: 'Results', tech: 'Technology', contact: 'Contact' },
};

export const getHeaderData = (lang: Lang) => {
  const m = MENU[lang];
  return {
    links: [
      { text: m.robots, href: localize('/robots', lang) },
      { text: m.results, href: localize('/competition', lang) },
      { text: m.tech, href: localize('/tech', lang) },
      { text: m.contact, href: localize('/contact', lang) },
    ],
    actions: [],
  };
};

export const getFooterData = (lang: Lang) => {
  const m = MENU[lang];
  const ja = lang === 'ja';
  return {
    links: [
      {
        title: ja ? 'チーム' : 'Team',
        links: [
          { text: ja ? 'NuTech-R について' : 'About NuTech-R', href: localize('/#about', lang) },
          { text: m.robots, href: localize('/robots', lang) },
          { text: m.contact, href: localize('/contact', lang) },
        ],
      },
      {
        title: ja ? '活動' : 'Activities',
        links: [{ text: m.results, href: localize('/competition', lang) }],
      },
      {
        title: ja ? '技術' : 'Technology',
        links: [
          { text: m.tech, href: localize('/tech', lang) },
          { text: ja ? 'Zenn（技術記事）' : 'Zenn (articles)', href: ZENN_PUBLICATION_URL },
          { text: 'GitHub', href: GITHUB_URL },
        ],
      },
      {
        title: ja ? '関連リンク' : 'Links',
        links: [
          { text: 'Nexis-R', href: NEXIS_R_URL },
          {
            text: ja ? '長岡技術科学大学' : 'Nagaoka University of Technology',
            href: ja ? 'https://www.nagaokaut.ac.jp/' : 'https://www.nagaokaut.ac.jp/e/',
          },
        ],
      },
    ],
    secondaryLinks: [],
    socialLinks: [
      { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: GITHUB_URL },
      { ariaLabel: 'Zenn', icon: 'tabler:notebook', href: ZENN_PUBLICATION_URL },
      { ariaLabel: 'YouTube', icon: 'tabler:brand-youtube', href: YOUTUBE_SEEK_URL },
    ],
    footNote: `© ${new Date().getFullYear()} NuTech-R. All rights reserved.`,
  };
};
