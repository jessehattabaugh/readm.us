import { db } from './db.js';
import { html } from 'https://cdn.skypack.dev/lit-html';
import { component, useState } from 'https://cdn.skypack.dev/haunted';

export const LoadFiles = component(() => {
	const [files, setFiles] = useState([]);

	return html` ${!files.length
		? html`<button
					@click="${async () => {
						console.info(`📚 loading books`);
						const dirHandle = await window.showDirectoryPicker();
						console.time('scanning');
						await scanDir(dirHandle);
						console.timeEnd('scanning');
						const names = await db.files
							.orderBy('name')
							.uniqueKeys();
						console.info(
							`🧾 found ${names.length} normalized names`,
						);
						setFiles(names);
					}}"
				>
					Load Files
				</button>
				<p>No files loaded yet</p>`
		: html`<p>${files.length} files found!</p>
				<ul>
					${files.map(
						(normalizedName) =>
							html`<li>
								<file-details
									.name=${normalizedName}
								></file-details>
							</li>`,
					)}
				</ul>`}`;
});

async function scanDir(dirHandle) {
	console.info(`📁 scanning directory for books`);
	for await (const entry of dirHandle.values()) {
		if (entry.kind == 'directory') {
			console.info(`📂 found a directory: ${entry.name}`);
			await scanDir(entry);
		} else if (entry.name.endsWith('epub') || entry.name.endsWith('pdf')) {
			console.info(`📕 found a book: ${entry.name}`);
			const normalizedName = (
				entry.name.substring(0, entry.name.lastIndexOf('.')) ||
				entry.name
			)
				.toLowerCase()
				.replaceAll(/[\W|_]+/g, '');
			let fileData;
			try {
				const file = await entry.getFile();
				const { name, type, lastModified, size } = file;
				fileData = {
					fileName: name,
					lastModified,
					name: normalizedName,
					size,
					type,
				};
			} catch (Error) {
				console.warn(`${entry.name} - ${Error.message}`);
				fileData = {
					name: normalizedName,
				};
			}
			db.files.add(fileData);
		}
	}
}
