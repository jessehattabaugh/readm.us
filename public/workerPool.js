import { getDatabase } from './db.js';
const db = await getDatabase();

const cores = navigator.hardwareConcurrency - 1;

export async function scanDirectory() {
	//console.debug(`👩‍🏭 starting directory scan`);
	const dirQueue = [];
	const workerPool = [];

	function doWork() {
		const nextWorker = workerPool.shift();
		nextWorker.postMessage(dirQueue.shift());
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
					//else console.debug(`👩‍🏭 no workers in pool`);
					break;

				case 'done':
					//console.debug(`👩‍🏭 finished scanning`);
					workerPool.push(event.target);
					if (dirQueue.length) doWork();
					//else console.debug(`👩‍🏭 no directories in queue`);
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
	const dirHandle = await window.showDirectoryPicker();
	dirQueue.push(dirHandle);
	doWork();
}
