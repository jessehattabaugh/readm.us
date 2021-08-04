//console.debug('👋🌎');

import { AppState } from './components/AppState.js';
customElements.define('app-state', AppState);

import { ScanDirectoryButton } from './components/ScanDirectoryButton.js';
customElements.define('scan-directory-button', ScanDirectoryButton);

import { FindDuplicatesButton } from './components/FindDuplicatesButton.js';
customElements.define('find-duplicates-button', FindDuplicatesButton);
