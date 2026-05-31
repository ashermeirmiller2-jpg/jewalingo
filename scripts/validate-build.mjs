import { access, readFile } from 'node:fs/promises';
const files = ['index.html','server.js','data/bm10a_mishnah.json','data/core300.json','data/chunks_bm10a.json'];
await Promise.all(files.map((file) => access(file)));
for (const file of files.filter((f) => f.endsWith('.json'))) JSON.parse(await readFile(file, 'utf8'));
const html = await readFile('index.html', 'utf8');
if (html.includes('src/app.js') || html.includes('src/styles.css')) throw new Error('index.html must be standalone with inline CSS and JS');
if (!html.includes('<style>') || !html.includes('<script>')) throw new Error('index.html is missing inline CSS or JS');
console.log('Build validation passed: standalone index.html and cached data are present. Open index.html or run npm run dev.');
