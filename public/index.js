console.info('👋🌎');
import { html } from 'https://cdn.skypack.dev/lit-html';
import { component, useState } from 'https://cdn.skypack.dev/haunted';

function LoadBooks() {
	const [books, setBooks] = useState([]);
	async function scanDir(dirHandle) {
		console.info(`📁 scanning directory for books`);
		for await (const entry of dirHandle.values()) {
			if (entry.kind == 'directory') {
				console.info(`📂 found a directory: ${entry.name}`);
				await scanDir(entry);
			} else if (entry.name.endsWith('epub')) {
				console.info(`📕 found a book: ${entry.name}`);
				setBooks((books) => [...books, entry.name]);
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
