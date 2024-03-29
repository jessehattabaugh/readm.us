//console.debug(`🗄👋`);

/** @type {IDBDatabase}*/
let cachedDb;

export function getDatabase() {
	return new Promise((resolve, reject) => {
		if (cachedDb) {
			//console.debug(`🗄 using the cachedDB`);
			resolve(cachedDb);
			return;
		}
		const request = indexedDB.open('readm.us', 1);
		request.onupgradeneeded = (event) => {
			//console.debug(`🗄 upgrade`);
			const result = request.result;
			switch (event.oldVersion) {
				case 0:
					//console.debug(`🗄 database doesn't exist initializing`);
					result.createObjectStore('files', { autoIncrement: true });
					break;
				default:
					console.warn(`🗄 unsupported database version`);
					break;
			}
		};
		request.onsuccess = () => {
			//console.debug(`🗄 success`);
			cachedDb = request.result;
			cachedDb.onversionchange = () => {
				console.error(`🗄 database version outdated`);
				cachedDb.close();
			};
			resolve(cachedDb);
		};

		request.onerror = () => {
			console.error(`🗄 error opening database: ${request.error}`, );
			reject();
		};
		request.onblocked = () => {
			console.error('🗄 database blocked');
		};
	});
}
