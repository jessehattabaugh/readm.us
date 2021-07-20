console.info('👋🌎');
import { html, LitElement } from 'https://cdn.skypack.dev/lit';

class LoadBooks extends LitElement {
	#dirHandle;
	_books = [];
	static get properties() {
		return {
			_books: { type: Array, state: true },
		};
	}
	async #loadBooks() {
		console.info(`📚 loading books`);
		this.#dirHandle = await window.showDirectoryPicker();
		await this.#scanDir(this.#dirHandle);
		console.info(`🧾 found ${this._books.length} books`);
	}
	async #scanDir(dirHandle) {
		console.info(`📁 scanning directory for books`);
		for await (const entry of dirHandle.values()) {
			if (entry.kind == 'directory') {
				console.info(`📂 found a directory: ${entry.name}`);
				await this.#scanDir(entry);
			} else if (entry.name.endsWith('epub')) {
				console.info(`📕 found a book: ${entry.name}`);
				this._books = [...this._books, entry.name];
			}
		}
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
