import { component, html } from 'https://cdn.skypack.dev/haunted';
import { scanDirectory } from './workerPool.js';

export const ScanDirectoryButton = component(() => {
	return html`<button
		@click=${scanDirectory}
		@directoryFound=${
			/** @param {CustomEvent} event */ (event) => {
				console.log(
					`🧈📂 directory found: ${event.detail.dirHandle.name}`,
				);
			}
		}
		@directoryScanned=${
			/** @param {CustomEvent} event */ (event) => {
				console.log(
					`🧈✅ directory scanned: ${event.detail.dirHandle.name}`,
				);
			}
		}
		@finishedScanning=${
			() => {
				console.log(
					`🧈🏁 finished scanning`,
				);
			}
		}
	>
		Scan Directory For Books
	</button>`;
});
