import {
	component,
	html,
	useEffect,
	useState,
} from 'https://cdn.skypack.dev/haunted';
import { countFiles } from './fileStore.js';
/**
 * @typedef {{dirHandle: {name: string}}} dirHandle
 * */
/** @type {CustomElementConstructor} */
export const FindDuplicatesButton = component(() => {
	const [fileCount, setFileCount] = useState(null);
	async function getCount() {
		const count = await countFiles();
		console.log(`files found ${count}`);
		setFileCount(count);
	}
	return html`<p>${fileCount} files found</p>
		<button @click=${getCount}>Find Duplicates</button>`;
});
