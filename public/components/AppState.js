import { countFiles } from '../fileStore.js';
import {
	component,
	html,
	useCallback,
	useEffect,
	useState,
} from 'https://cdn.skypack.dev/haunted';

/** @type {CustomElementConstructor} */
export const AppState = component(() => {
	const [fileCount, setFileCount] = useState(null);

	const updateCount = useCallback(async () => {
		console.log(`updating count`);
		const count = await countFiles();
		setFileCount(count);
	}, []);

	useEffect(() => {
		console.log(`effecting`);
		updateCount();
	}, []);

	return html`<main>
		<scan-directory-button
			@finishedScanning=${updateCount}
		></scan-directory-button>
		${fileCount
			? html`<p>Files: ${fileCount}</p>
					<find-duplicates-button></find-duplicates-button>`
			: 'No Files Yet'}
	</main>`;
});
