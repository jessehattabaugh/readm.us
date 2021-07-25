//console.debug('👋🌎');
import { scanDirectory } from './workerPool.js';
const scanDirBtn = document.getElementsByTagName('button')[0];
scanDirBtn.addEventListener('click', scanDirectory);

//import { addFile } from './fileStore.js';
