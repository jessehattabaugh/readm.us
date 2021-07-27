import { component, html, useState } from 'https://cdn.skypack.dev/haunted';
import { scanDirectory } from './workerPool.js';
/**
 * @typedef {{dirHandle: {name: string}}} dirHandle
 * */
export const ScanDirectoryButton = component(() => {
	const [status, setStatus] = useState('waiting');
	const [scanned, setScanned] = useState(0);
	return html`<button
			?disabled="${status !== 'waiting'}"
			@click=${function () {
				setStatus('scanning');
				scanDirectory.call(this);
			}}
			@directoryScanned=${
				/** @param {CustomEvent<dirHandle>} event */ (event) => {
					setScanned(scanned + 1);
					//console.log(`🧈✅ directory scanned: ${event.detail.dirHandle.name}`);
				}
			}
			@finishedScanning=${() => {
				setStatus('waiting');
				setScanned(0);
				console.log(`🧈🏁 finished scanning`);
			}}
		>
			${status == 'scanning'
				? 'Scanning'
				: 'Scan Directory For Books'}</button
		>${status == 'scanning' ? `scanned ${scanned} directories` : ''}`;
});
