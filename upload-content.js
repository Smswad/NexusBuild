// upload-content.js
// One-off script: creates a Gemini File Search Store and uploads all files
// in src/SiteContent/ to it.
// Run with: node upload-content.js

import { readFileSync, readdirSync } from 'fs';
import { resolve, join, extname, dirname } from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

// ── Manual .env loading (avoids a dynamic require with ESM) ─────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf-8');

for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
}

// ── Config ───────────────────────────────────────────────────────────────────
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error('❌  GEMINI_API_KEY not found in .env');
    process.exit(1);
}

const SITE_CONTENT_DIR = resolve(__dirname, 'src/SiteContent');
const STORE_DISPLAY_NAME = 'nexusbuild-site';

// Mime type mapping for text files
function getMimeType(filePath) {
    const ext = extname(filePath).toLowerCase();
    const map = {
        '.md':   'text/plain',
        '.txt':  'text/plain',
        '.json': 'application/json',
        '.html': 'text/html',
        '.pdf':  'application/pdf',
    };
    return map[ext] ?? 'text/plain';
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    // 1. Create a new File Search Store
    console.log(`\n📦  Creating File Search Store "${STORE_DISPLAY_NAME}"...`);
    const store = await ai.fileSearchStores.create({
        config: { displayName: STORE_DISPLAY_NAME }
    });
    const storeName = store.name;
    console.log(`✅  Store created: ${storeName}\n`);

    // 2. List files in SiteContent/
    const files = readdirSync(SITE_CONTENT_DIR).filter(f => !f.startsWith('.'));
    console.log(`📂  Found ${files.length} file(s) in src/SiteContent/:`);
    files.forEach(f => console.log(`     - ${f}`));
    console.log('');

    // 3. Upload each file to the store
    for (const fileName of files) {
        const filePath = join(SITE_CONTENT_DIR, fileName);
        const mimeType = getMimeType(filePath);
        process.stdout.write(`⬆️   Uploading ${fileName} (${mimeType})... `);

        try {
            const operation = await ai.fileSearchStores.uploadToFileSearchStore({
                fileSearchStoreName: storeName,
                file: filePath,
                config: { mimeType }
            });
            console.log(`done (operation: ${operation.name ?? 'created'})`);
        } catch (err) {
            console.error(`FAILED — ${err.message}`);
        }
    }

    // 4. Print the store name for .env
    console.log('\n──────────────────────────────────────────────');
    console.log(`✅  All uploads submitted.`);
    console.log(`\nGEMINI_FILE_SEARCH_STORE=${storeName}`);
    console.log('──────────────────────────────────────────────\n');
    console.log('Add the line above to your .env file.');
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
