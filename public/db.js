console.debug(`🗄👋`);
let cachedDb;
export function getDatabase() {
	return new Promise((resolve, reject) => {
		if (cachedDb) {
			resolve(cachedDb);
			return;
		}
		const request = indexedDB.open('readm.us', 1);

		request.onupgradeneeded = (event) => {
			console.debug(`🗄 upgrade`);
			const result = request.result;
			switch (event.oldVersion) {
				case 0:
					console.debug(`🗄 database doesn't exist initializing`);
					result.createObjectStore('files', { autoIncrement: true });
					break;
				default:
					console.warn(`🗄 unsupported database version`);
					break;
			}
		};

		request.onsuccess = () => {
			console.debug(`🗄 success`);
			cachedDb = request.result;
			cachedDb.onversionchange = () => {
				console.error(`🗄 database version outdated`);
				cachedDb.close();
			};
			resolve(cachedDb);
		};

		request.onerror = (event) => {
			reject(`🗄 error opening database ${event.target.errorCode}`);
		};

		request.onblocked = () => {
			console.error('🗄 database blocked');
		};
	});
}
