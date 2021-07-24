import { db } from './db.js';
import { html } from 'https://cdn.skypack.dev/lit-html';
import { component, useState } from 'https://cdn.skypack.dev/haunted';
import { distance as leven } from 'https://cdn.skypack.dev/fastest-levenshtein';

export const LoadFiles = component(() => {
	const [status, setStatus] = useState('');
	const [duplicates, setDuplicates] = useState([]);

	async function onClick() {
		const dirHandle = await window.showDirectoryPicker();
		setStatus('scanning for files');
		console.time('🔍 scanning for files');
		await scanDir(dirHandle);
		console.timeEnd('🔍 scanning for files');
		setStatus('looking for duplicates');
		const names = await db.files.orderBy('name').uniqueKeys();
		const n = names.length;
		console.info(`🧾 found ${n} unique file names`);
		console.time('📏 calculating distances');
		let toAdd = [];
		for (let i = 0; i < n; i++) {
			const fileName = names[i];
			for (let j = i + 1; j < n; j++) {
				const otherFileName = names[j];
				const distance = leven(fileName, otherFileName);
				if (distance < 10) {
					toAdd.push({
						fileName,
						otherFileName,
						distance,
					});
				}
			}
			//console.debug(`👬 compared all distances for ${fileName}`);
			await db.distances.bulkAdd(toAdd);
			toAdd = [];
		}
		console.timeEnd('📏 calculating distances');
		const distances = await db.distances.orderBy('fileName').toArray();
		const duplicates = distances.reduce((acc, cur, i) => {
			const { fileName, otherFileName, distance } = cur;
			acc[fileName] = [
				...(acc[fileName] || []),
				{ otherFileName, distance },
			];
			return acc;
		}, []);
		setDuplicates(duplicates);
		setStatus('done');
	}

	return html` <h2>Status: ${status}</h2>
		${!duplicates.length
			? html`<button @click="${onClick}">Load Files</button>
					<p>No files loaded yet</p>`
			: html`<p>${duplicates.length} files found!</p>
					<ul>
						${duplicates.map(
							({ fileName, otherFileName, distance }) =>
								html`<li>
									${distance} : ${fileName} - ${otherFileName}
								</li>`,
						)}
					</ul>`}`;
});

async function scanDir(dirHandle) {
	//console.debug(`📁 scanning directory for books`);
	let toAdd = [];
	for await (const entry of dirHandle.values()) {
		if (entry.kind == 'directory') {
			//console.debug(`📂 found a directory: ${entry.name}`);
			await scanDir(entry);
		} else if (entry.name.endsWith('epub') || entry.name.endsWith('pdf')) {
			const name =
				entry.name.substring(0, entry.name.lastIndexOf('.')) ||
				entry.name;
			//console.debug(`📕 found a book: ${entry.name}`);
			let fileData;
			try {
				const file = await entry.getFile();
				const { type, lastModified, size } = file;
				fileData = {
					lastModified,
					name,
					size,
					type,
				};
			} catch (Error) {
				console.warn(`${entry.name} - ${Error.message}`);
				fileData = {
					name,
				};
			}
			toAdd.push(fileData);
		}
	}
	db.files.bulkAdd(toAdd);
	toAdd = [];
}
