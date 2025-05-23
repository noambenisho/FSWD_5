import fs from 'node:fs/promises';

const endpoints = ['users', 'posts', 'comments', 'albums', 'photos', 'todos'];
const base = 'https://jsonplaceholder.typicode.com';

const db = Object.fromEntries(
    await Promise.all(
      endpoints.map(async ep => [ep, await (await fetch(`${base}/${ep}`)).json()])
    )
);

// Fix the broken photo URLs (placeholder’s images 404):
db.photos = db.photos.map(p => ({
    ...p,
    url: `https://picsum.photos/id/${p.id}/600/400`,
    thumbnailUrl: `https://picsum.photos/id/${p.id}/150/100`
}));

await fs.writeFile('data/db.json', JSON.stringify(db, null, 2));
console.log('db.json created/updated');
