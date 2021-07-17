console.log('👋🌎');
/*

const button = document.getElementById('openBooksDirectory');
const books = [];

async function scanDir(dirHandle) {
	for await (const entry of dirHandle.values()) {
		if (entry.kind == 'directory') {
			await scanDir(entry);
		} else if (entry.name.endsWith('epub')) {
			books.push(entry.name);
		}
	}
}

button.addEventListener('click', async () => {
	const dirHandle = await window.showDirectoryPicker();
	await scanDir(dirHandle);
	console.dir(books.sort());
});
*/
