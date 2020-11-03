
import React, { useState } from 'react';

export default function Home() {

  const [readableFiles, setReadableFiles] = useState([]);

  console.log(typeof readableFiles, readableFiles);

  async function showDirectoryPicker() {
    const dirHandle = await window.showDirectoryPicker();

    async function scanDirectory(dirHandle) {
      const pickedFiles = [];
      for await (const entry of dirHandle.values()) {
        //console.dir(entry);
        switch (entry.kind) {
          case 'file':
            //console.log(`📄 File named ${entry.name}`);
            if (entry.name.endsWith('.epub')) {
              console.log(`📚 Found a book ${entry.name}`);
              pickedFiles.push(entry);
            }
            break;
          case 'directory':
            //console.log(`📁 Directory named ${entry.name}`);
            scanDirectory(entry);
            break;
          default:
            //console.log(`🤷 ${entry}`, entry);
            break;
        }
      }
      //console.log(`🕵️ Directory Scanned`, dirHandle);
      return pickedFiles;
    }
    
    const pickedFiles = await scanDirectory(dirHandle);
    console.dir(pickedFiles)
    setReadableFiles(pickedFiles);
  }

  return (<div>
    <h1>readm.us</h1>
    <h2>the PWA that reads to you</h2>
    <button onClick={showDirectoryPicker}>Pick the directory where you store your books</button>
    {readableFiles.length ? <section>
      <h3>Found {readableFiles} epub files</h3>
      <ul>
        {readableFiles.map(({ name }, i) => <li key={i}>{name}</li>)}
      </ul>
    </section> : <div>no files yet</div>}
  </div>)
};