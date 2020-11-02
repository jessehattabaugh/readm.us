
export default function Home() {
  return (<div>
    <h1>readm.us</h1>
    <h2>the PWA that reads to you</h2>
    <button onClick={readSomething}>Give me something to read</button>
  </div>)
}

async function readSomething() {
  const someFiles = await window.showOpenFilePicker({ multiple: true });
  //const someFiles = await window.showOpenFilePicker();
  for (const file of someFiles) {
    console.log(file.kind, file.name);
  }

}
