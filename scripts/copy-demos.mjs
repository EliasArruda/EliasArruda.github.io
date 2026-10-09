import { cp, lstat, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const source = resolve('demos');
const destination = resolve('dist/demos');
async function rejectSymlinks(path) {
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw new Error(`Demo contains a symlink: ${path}`);
    if (info.isDirectory()) for (const entry of await readdir(path)) await rejectSymlinks(join(path, entry));
}
for (const entry of await readdir(source, { withFileTypes: true })) {
    if (entry.name === 'README.md') continue;
    if (!entry.isDirectory() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.name)) throw new Error(`Invalid demo directory: ${entry.name}`);
    const path = join(source, entry.name);
    await rejectSymlinks(path);
    if (!(await lstat(join(path, 'index.html'))).isFile()) throw new Error(`Missing demo entry point: ${entry.name}/index.html`);
    await mkdir(destination, { recursive: true });
    await cp(path, join(destination, entry.name), { recursive: true, errorOnExist: true, force: false });
    const assets = join(destination, entry.name, 'assets');
    await mkdir(assets, { recursive: true });
    for (const shared of await readdir(resolve('demo-kit'), { withFileTypes: true })) {
        if (!shared.isFile()) throw new Error(`Invalid shared asset: ${shared.name}`);
        await cp(join(resolve('demo-kit'), shared.name), join(assets, shared.name), { errorOnExist: true, force: false });
    }
    // Opaque-origin sandbox frames cannot fetch same-site fonts without CORS headers.
    // Embed the required WOFF2 faces, so the exact typography works on any static host.
    const style = await readFile(join(path, 'assets/style.css'), 'utf8');
    const fontSource = await readFile(resolve('demo-kit/fonts.css'), 'utf8');
    const faces = fontSource.match(/@font-face\s*\{[^}]+\}/g) ?? [];
    const embedded = [];
    for (const face of faces) {
        const family = face.match(/font-family: '([^']+)'/)?.[1];
        if (family !== 'DM Sans' && !style.includes(`'${family}'`)) continue;
        const filename = face.match(/url\(([^)]+)\)/)?.[1];
        if (!filename || !/^font-\d+\.woff2$/.test(filename)) throw new Error('Invalid font asset');
        const bytes = await readFile(resolve('demo-kit', filename));
        embedded.push(face.replace(filename, `data:font/woff2;base64,${bytes.toString('base64')}`));
    }
    await writeFile(join(assets, 'fonts.css'), embedded.join('\n'));
    console.log(`Published static demo: /demos/${entry.name}/`);
}
