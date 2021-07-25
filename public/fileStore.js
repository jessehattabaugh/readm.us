/*import { getDatabase } from './db.js';

const db = await getDatabase();

export function addFile(entry) {
	return new Promise((resolve, reject) => {
		console.debug(`🗃 storing file: ${entry.name}`);

		const transaction = db.transaction(['files'], 'readwrite');
		transaction.oncomplete = resolve;
		transaction.onerror = (event) => {
			reject(`error storing file ${event.target.errorCode}`);
		};

		const store = transaction.objectStore('files');
		const extDot = entry.name.lastIndexOf('.');
		const name = entry.name.substring(0, extDot) || entry.name;
		const fileData = { name };
		try {
			const file = await entry.getFile();
			const { lastModified, size, type } = file;
			Object.assign(fileData, { lastModified, size, type });
		} catch (Error) {
			console.warn(`${entry.name} - ${Error.message}`);
		}
		store.add(fileData);
	});
}
*/
console.log('wtf');
