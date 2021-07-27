import { getDatabase } from './db.js';
const db = await getDatabase();

const cores = navigator.hardwareConcurrency - 1;

export async function scanDirectory() {
	//console.debug(`👩‍🏭 starting directory scan`);
	/** @type {Object[]} */
	const dirQueue = [];
	/** @type {Worker[]} */
	const workerPool = [];
	let finishedWorkers = 0;

	function doWork() {
		const nextWorker = workerPool.shift();
		nextWorker.postMessage({
			dirHandle: dirQueue.shift(),
		});
	}

	// fill the workerPool
	for (let i = 0; i < cores; i++) {
		const worker = new Worker('./dirScanWorker.js', { type: 'module' });
		worker.onmessage = (event) => {
			const { message, dirHandle } = event.data;
			switch (message) {
				case 'foundDir':
					//console.debug(`👩‍🏭 found a directory`);
					dirQueue.push(dirHandle);
					if (workerPool.length) doWork();
					//else console.warn(`👩‍🏭 no workers in pool`);
					break;

				case 'done':
					//console.debug(`👩‍🏭 finished scanning`);
					this.dispatchEvent(
						new CustomEvent('directoryScanned', {
							detail: {
								dirHandle,
							},
						}),
					);
					workerPool.push(worker);

					if (dirQueue.length) doWork();
					else {
						finishedWorkers++;
						//console.warn(`👩‍🏭☑ finishedWorkers: ${finishedWorkers}/${cores}`);
						worker.terminate();
						if (finishedWorkers >= cores) {
							//console.log(`👩‍🏭 🏁 finished scanning`);
							this.dispatchEvent(
								new CustomEvent('finishedScanning'),
							);
						}
					}
					break;

				default:
					console.warn(`👩‍🏭 unknown message: ${message}`);
					break;
			}
		};
		worker.onerror = (error) => {
			console.error(`👩‍🏭 error: ${error.message}`);
		};
		workerPool.push(worker);
	}

	// start up the first worker

	/**
	 * @typedef {Window & typeof globalThis & {showDirectoryPicker: function}} FileSystemAccessWindow
	 */
	/**
	 * @type {FileSystemAccessWindow}
	 */
	/* prettier-ignore */
	let w = (window);
	const dirHandle = await w.showDirectoryPicker();
	dirQueue.push(dirHandle);
	doWork();
}
