import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { AstroIntegration } from 'astro';
import { loadDefaultJapaneseParser } from 'budoux';
import { parseHTML } from 'linkedom';

// Inserts <wbr> between Japanese phrases (BudouX) in the built HTML. Together with
// `word-break: keep-all` (src/assets/styles/tailwind.css) lines then break between phrases
// instead of in the middle of a word, in every browser (Chrome's `auto-phrase` does not
// reach iOS).

// Header / menus hold short labels that must never wrap: Chrome breaks at <wbr> even under nowrap.
const SKIP = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'TEXTAREA',
  'PRE',
  'CODE',
  'TITLE',
  'SVG',
  'IFRAME',
  'HEADER',
  'NAV',
]);
// Short labels (buttons, menu items) read better unbroken.
const MIN_LENGTH = 10;
// Hiragana, katakana and CJK ideographs.
const JAPANESE = /[぀-ヿ㐀-鿿]/;
const SHOW_TEXT = 0x4; // NodeFilter.SHOW_TEXT (linkedom does not expose NodeFilter)

const listHtmlFiles = async (dir: string): Promise<string[]> => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return listHtmlFiles(p);
      return Promise.resolve(e.name.endsWith('.html') ? [p] : []);
    })
  );
  return nested.flat();
};

export default function budouxWbr(): AstroIntegration {
  return {
    name: 'budoux-wbr',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const parser = loadDefaultJapaneseParser();
        const files = await listHtmlFiles(fileURLToPath(dir));

        for (const file of files) {
          const { document } = parseHTML(await fs.readFile(file, 'utf-8'));
          const walker = document.createTreeWalker(document.body, SHOW_TEXT);
          const targets: Text[] = [];
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const text = node as Text;
            if (text.data.trim().length < MIN_LENGTH || !JAPANESE.test(text.data)) continue;
            let skip = false;
            for (let el = text.parentElement; el; el = el.parentElement) {
              if (SKIP.has(el.tagName.toUpperCase())) {
                skip = true;
                break;
              }
            }
            if (!skip) targets.push(text);
          }

          for (const text of targets) {
            const phrases = parser.parse(text.data);
            if (phrases.length < 2) continue;
            const fragment = document.createDocumentFragment();
            phrases.forEach((phrase, i) => {
              if (i > 0) fragment.appendChild(document.createElement('wbr'));
              fragment.appendChild(document.createTextNode(phrase));
            });
            text.replaceWith(fragment);
          }

          await fs.writeFile(file, document.toString());
        }
        logger.info(`Inserted phrase breaks into ${files.length} HTML files`);
      },
    },
  };
}
