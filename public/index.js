console.info('👋🌎');
import { html, LitElement } from 'https://cdn.skypack.dev/lit';

async function scanDir(dirHandle) {
	console.info(`📁 scanning directory for books`);
	let out = [];
	for await (const entry of dirHandle.values()) {
		if (entry.kind == 'directory') {
			console.info(`📂 found a directory: ${entry.name}`);
			const found = await scanDir(entry);
			out = out.concat(found);
		} else if (entry.name.endsWith('epub')) {
			console.info(`📕 found a book: ${entry.name}`);
			out.push(entry.name);
		}
	}
	return out;
}
class LoadBooks extends LitElement {
	constructor() {
		super();
		this._books = [];
	}
	static get properties() {
		return {
			_books: { type: Array, state: true },
		};
	}
	async #loadBooks() {
		console.info(`📚 loading books`);
		const dirHandle = await window.showDirectoryPicker();
		console.time('scanning');
		const found = await scanDir(dirHandle);
		console.timeEnd('scanning');
		console.info(`🧾 found ${found.length} books`);
		this._books = found;
	}
	render() {
		return html`<button @click="${this.#loadBooks}">Load Books</button>
			${this._books.length
				? html`<ul>
						${this._books.map((book) => html`<li>${book}</li>`)}
				  </ul>`
				: html`<p>No books loaded yet</p>`}`;
	}
}

customElements.define('load-books', LoadBooks);
