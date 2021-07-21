console.info('👋🌎');
import { html } from 'https://cdn.skypack.dev/lit-html';
import { component, useState } from 'https://cdn.skypack.dev/haunted';
import Dexie from 'https://cdn.skypack.dev/dexie';

const db = new Dexie('Books');
db.version(1).stores({
	files: '++id, name',
});

function LoadBooks() {
	const [books, setBooks] = useState([]);
	async function scanDir(dirHandle) {
		console.info(`📁 scanning directory for books`);
		for await (const entry of dirHandle.values()) {
			if (entry.kind == 'directory') {
				console.info(`📂 found a directory: ${entry.name}`);
				await scanDir(entry);
			} else if (
				entry.name.endsWith('epub') ||
				entry.name.endsWith('pdf')
			) {
				let title =
					entry.name.substring(0, entry.name.lastIndexOf('.')) ||
					entry.name;
				title = title.toLowerCase().replaceAll(/[\W|\d|_]+/g, '');
				console.info(`📕 found a book: ${title}`);
				try {
					const file = await entry.getFile();
					const { name, type, lastModified, size } = file;
					db.files.add({
						fullName: name,
						lastModified,
						name: title,
						size,
						type,
					});
				} catch (Error) {
					console.error(
						`${Error.code} - ${Error.name} - ${Error.message}`,
					);
				}
				//debugger;
				//setBooks((books) => [...books, entry.name]);
			}
		}
	}
	return html`<button
			@click="${async () => {
				console.info(`📚 loading books`);
				const dirHandle = await window.showDirectoryPicker();
				console.time('scanning');
				await scanDir(dirHandle);
				console.timeEnd('scanning');
				const names = await db.files.orderBy('name').uniqueKeys();
				setBooks(names);
				console.info(`🧾 found ${books.length} books`);
			}}"
		>
			Load Books
		</button>
		${books.length
			? html`<ul>
					${books.map((book) => html`<li>${book}</li>`)}
			  </ul>`
			: html`<p>No books loaded yet</p>`}`;
}

customElements.define('load-books', component(LoadBooks));
