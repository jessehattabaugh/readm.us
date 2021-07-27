// @ts-nocheck
import { db } from './db.js';
import { html } from 'https://cdn.skypack.dev/lit-html';
import { component, useState } from 'https://cdn.skypack.dev/haunted';

export const FileDetails = component(({ name }) => {
	const [details, setDetails] = useState([]);
	return html`<details
		@click=${async () => {
			if (!details.length) {
				const filesWithName = await db.files
					.where('name')
					.equals(name)
					.toArray();
				console.log(`🗃 listing files ${name} - ${filesWithName}`);
				setDetails(filesWithName);
			}
		}}
	>
		<summary>${name}</summary>
		${details.length
			? html`<ol>
					${details.map(({ fileName }) => html`<li>${fileName}</li>`)}
			  </ol>`
			: html`<p>no files</p>`}
	</details>`;
});
