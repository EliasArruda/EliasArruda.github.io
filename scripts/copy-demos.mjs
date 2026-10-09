import { cp, lstat, mkdir, readdir } from 'node:fs/promises';
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
    console.log(`Published static demo: /demos/${entry.name}/`);
}
