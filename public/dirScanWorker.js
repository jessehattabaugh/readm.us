//console.debug(`🔎👋`);
import { addFile } from './fileStore.js';
onmessage = async (event) => {
	const dirHandle = event.data;
	//console.debug(`🔎 scanning: ${dirHandle.name}`);
	for await (const entry of dirHandle.values()) {
		if (entry.kind == 'directory') {
			//console.debug(`🔎📂 found a directory: ${entry.name}`);
			postMessage({ message: 'foundDir', dirHandle: entry });
		} else if (entry.name.endsWith('epub') || entry.name.endsWith('pdf')) {
			//console.debug(`🔎📕 found a book: ${entry.name}`);
			await addFile(entry);
		} else {
			//console.debug(`🔎📄 unsupported file type: ${entry.name}`);
		}
	}
	postMessage({ message: 'done' });
};
