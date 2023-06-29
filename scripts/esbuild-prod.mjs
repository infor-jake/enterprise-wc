/* eslint-disable no-console */
// Custom Build Script Using Es Build
// usage:
//  node scripts/esbuild-prod.mjs -- mode=production
//  node scripts/esbuild-prod.mjs -- mode=development
//  node scripts/esbuild-prod.mjs
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as esbuild from 'esbuild';
// eslint-disable-next-line import/no-extraneous-dependencies
import { sassPlugin } from 'esbuild-sass-plugin';
// eslint-disable-next-line import/extensions
import fsFiles from './node-fs-files.mjs';

const args = process.argv;
const mode = args[2] && args[2].indexOf('mode') > 1 ? args[3] : 'development';

// Clean out directory first
const outDir = mode === 'production' ? 'build/dist/production' : 'build/dist/development';
fs.rmSync(outDir, { recursive: true, force: true });

let components = fsFiles('./src/', 'ts');
components = components.filter((item) => (!item.includes('demo') && !item.includes('-base') && !item.includes('ids-locale/data')));
const themes = fsFiles('./src/', 'scss').filter((item) => (item.includes('themes/default')));

const cssFiles = [];

// Run EsBuild
// eslint-disable-next-line max-len
// npx esbuild src/components/ids-tag/ids-tag.ts src/components/ids-alert/ids-alert.ts --bundle --splitting --outdir=out --format=esm
const result = await esbuild
  .build({
    entryPoints: [...components, ...themes],
    outdir: outDir,
    bundle: true,
    // splitting: true,
    minify: mode === 'production',
    sourcemap: mode === 'development',
    chunkNames: 'chunks/ids-[name]-[hash]',
    format: 'esm',
    metafile: true,
    plugins: [
      sassPlugin({
        type: 'css-text',
        transform(source, dir, filePath) {
          // Make the css file for standalone css
          const rootDir = path.basename(path.dirname(dir));
          if (rootDir === 'components') {
            const noHost = source.replace(':host {', ':root {');
            const comp = path.basename(path.dirname(filePath));
            const file = `${outDir}${path.sep}components${path.sep}${comp}${path.sep}${comp}.css`;
            cssFiles.push({ file, source: noHost });
            fs.mkdirSync(path.dirname(file), { recursive: true }, () => {});
            fs.writeFileSync(file, noHost, () => {});
          }

          if (rootDir === 'themes') {
            const comp = path.basename(filePath);
            const folder = `${outDir}${path.sep}themes${path.sep}`;
            const file = `${folder}${comp.replace('.scss', '.css')}`;
            fs.mkdirSync(folder, { recursive: true }, () => { });
            fs.writeFileSync(file, source.split('/*# sourceMappingURL')[0], () => { });
          }
          return source;
        }
      })
    ],
  })
  .catch(() => process.exit(1));

// Copy Locales
const locales = fsFiles('./src/components/ids-locale/data', 'ts');
const localeDir = `${outDir}/locale-data/`;
fs.mkdirSync(localeDir, { recursive: true }, () => {});

locales.forEach((locale) => {
  fs.copyFileSync(locale, `${localeDir}${path.basename(locale)}`.replace('.ts', '.js'));
});

// Copy Types
let types = fsFiles('./build/types/src', 'd.ts');
types = types.filter((item) => (!item.includes('demo')
    && !item.includes('locale-data')
    && !item.includes('ids-locale/data/')
    && !item.includes('ids-locale/info/')
    && !item.includes('ids-locale-global')
    && !item.includes('cultures')
    && !item.includes('themes/ids-theme')));

types.forEach((type) => {
  fs.copyFileSync(type, type.replace('build/types/src', outDir));
});

// Copy Markdown
fs.copyFileSync('./LICENSE', `${outDir}/LICENSE`);
fs.copyFileSync('./README.md', `${outDir}/README.md`);

// Copy Schemas
fs.copyFileSync('./custom-elements.json', `${outDir}/custom-elements.json`);
fs.copyFileSync('./vscode.html-custom-data.json', `${outDir}/vscode.html-custom-data.json`);

// Minify locale data
if (mode === 'production') {
  fs.rmSync(`${outDir}/locale-data`, { recursive: true, force: true });

  const localesOnly = fsFiles('./src/components/ids-locale/data', 'ts');
  await esbuild
    .build({
      entryPoints: localesOnly,
      outdir: `${outDir}/locale-data`,
      minify: true,
    })
    .catch(() => process.exit(1));
}

fs.rmSync(`${outDir}/themes/default`, { recursive: true, force: true });

// Create Stats File
// Can view this file at https://esbuild.github.io/analyze/
fs.writeFileSync('build-stats.json', JSON.stringify(result.metafile));
console.info(`⚡ Build complete ⚡`);
