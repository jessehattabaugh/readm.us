import Dexie from 'https://cdn.skypack.dev/dexie';

export const db = new Dexie('Books');

db.version(1).stores({
	files: '++id, name',
	distances: '++id, &[fileName+otherFileName], &[otherFileName+fileName]',
});
