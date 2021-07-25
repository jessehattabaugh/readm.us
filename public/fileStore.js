console.debug('🗃👋');
import { getDatabase } from './db.js';
const db = await getDatabase();
export function addFile(entry) {
	return new Promise(async (resolve, reject) => {
		console.debug(`🗃 storing file: ${entry.name}`);
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
		const transaction = db.transaction('files', 'readwrite');
		const filesStore = transaction.objectStore('files');
		let request = filesStore.add(fileData);
		request.onsucess = () => {
			console.debug(`🗃 success`);
		};
		request.onerror = () => {
			reject(`🗃 request error ${request.error.name}`);
		};
		transaction.oncomplete = resolve;
		transaction.onabort = () => {
			reject(`🗃 transation error ${transaction.error}`);
		};
	});
}
