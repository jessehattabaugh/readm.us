
export default function Home() {
  return (<div>
    <h1>readm.us</h1>
    <h2>the PWA that reads to you</h2>
    <button onClick={showDirectoryPicker}>Give me something to read</button>
  </div>)
}

async function showDirectoryPicker() {
  const dirHandle = await window.showDirectoryPicker();
  for await (const entry of dirHandle.values()) {
    console.dir(entry);
    switch (entry.kind) {
      case 'file':
        console.log(`File named ${entry.name}`);
        break;
      case 'directory':
        console.log(`Directory named ${entry.name}`);
      break;
      default:
        console.log(entry);
        break;
    }
  }
}
