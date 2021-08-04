//console.debug('🗃👋');
import { getDatabase } from './db.js';
const db = await getDatabase();
/**
 * @param {Object} entry
 * @param {string} entry.name
 * @param {function} entry.getFile
 */
export function addFile(entry) {
	return new Promise(async (resolve, reject) => {
		//console.debug(`🗃 storing file: ${entry.name}`);
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

		// transactions must be started after awaits
		const transaction = db.transaction('files', 'readwrite');
		const filesStore = transaction.objectStore('files');
		// todo: batch file adds
		const request = filesStore.add(fileData);
		/*request.onsucess = () => {
			console.debug(`🗃 successfully added a file`);
		};*/
		request.onerror = () => {
			reject(`🗃 request error ${request.error.name}`);
		};
		transaction.onabort = () => {
			reject(`🗃 transation error ${transaction.error}`);
		};
		transaction.oncomplete = resolve;
	});
}

export function countFiles() {
	return new Promise(async (resolve, reject) => {
		const transaction = db.transaction('files', 'readwrite');
		const filesStore = transaction.objectStore('files');
		const request = filesStore.count();
		request.onsuccess = () => {
			resolve(request.result);
		};
	});
}
