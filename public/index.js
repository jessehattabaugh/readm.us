//console.debug('👋🌎');

import { AppState } from './AppState.js';
customElements.define('app-state', AppState);

import { ScanDirectoryButton } from './ScanDirectoryButton.js';
customElements.define('scan-directory-button', ScanDirectoryButton);

import { FindDuplicatesButton } from './FindDuplicatesButton.js';
customElements.define('find-duplicates-button', FindDuplicatesButton);
