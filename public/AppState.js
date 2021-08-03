import { countFiles } from './fileStore.js';
import { html, LitElement } from 'https://cdn.skypack.dev/lit';

export class AppState extends LitElement {
	constructor() {
		super();
		this.fileCount = 0;
	}
	static get properties() {
		return {
			fileCount: { type: Number },
		};
	}
	async connectedCallback() {
		super.connectedCallback();
		this.fileCount = await countFiles();
	}
	render() {
		return html`<main>
			<scan-directory-button
				@finishedScanning=${async () => {
					console.log(`🍎🏁 finished scanning`);
					this.fileCount = await countFiles();
				}}
			></scan-directory-button>
			${this.fileCount
				? html`<p>Files: ${this.fileCount}</p>
						<find-duplicates-button></find-duplicates-button>`
				: 'No Files Yet'}
		</main>`;
	}
}
