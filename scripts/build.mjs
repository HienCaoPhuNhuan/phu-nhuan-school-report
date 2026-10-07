import { mkdir, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../dist/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const item of ['index.html', 'styles.css', 'presentation.css', 'app.js', 'pagination.js', 'typography.js', 'photo-presentation.js', 'section-media.js', 'narration.js', 'timed-media.js', 'sections.js', 'content.js', 'assets']) {
  await cp(root + item, new URL(item, output), { recursive: true });
}
console.log('Static website built in dist/');
