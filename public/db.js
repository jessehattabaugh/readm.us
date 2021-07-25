let db;
export function getDatabase() {
	return new Promise((resolve, reject) => {
		if (db) {
			resolve(db);
			return;
		}
		const request = indexedDB.open('readm.us', 1);

		request.onupgradeneeded = (event) => {
			console.debug(`📇 upgrade`);
			const { result } = event.target;
			if (result.objectStoreName.contains('files')) {
				console.debug(`files store exists`);
				request.transaction.objectStore('files');
			} else {
				console.debug(`creating the files store`);
				db.createObjectStore('files', {
					autoIncrement: true,
				});
			}
		};

		request.onsuccess = (event) => {
			console.debug(`📇 success`);
			db = event.target.result;
			resolve(db);
		};

		request.onerror = (event) => {
			reject(`error opening database ${event.target.errorCode}`);
		};
	});
}
