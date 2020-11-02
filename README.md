# readm.us' readme

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## The Problem

I'm an Instapaper/Google Play Books user because they read to me when I'm in the bath. However, these are both native apps that spy and use lots of resources. Instapaper insists on reading all the punctuation, and it sounds terrible when they hit blocks of code, which is common in my kinds of books. Google Play Books is only capable of reading epub files, but half my books are PDFs. 

## The Solution

There are several browser APIs that have been recently introduced or still in development which could allow a web site to perform all the current functions of Instapaper or Google Play Books, but without the native apps. 

### Speech Synthesis API

This API is well supported, but not very flexible. You give it a block of text to read and it reads it. For large blocks of text you probably need to split into sentences, then have those sentences read aloud one at a time. On some browsers you may be able to alter the speed and pitch of this voice. These APIs use the native speech synthesis engines to do the work, and so probably vary widely in quality and efficiency. Still, there is potential for them to be as high quality as native, and to work offline which is ideal. 

### Share Target API

One of the more compelling reasons to install a "read later" app is that when you are browsing the web on a mobile device you are allowed to "share" or "send" the page to other native installed apps. The Share Target API allows a Progressive Web App to participate in this user interface by having it's icon appear in the "share" list. In this way an installed Web App can receive pages to read later using the same mechanism currently used by Instapaper, and Pocket. 

### File System Access

This API is the newest and likely only supported with a flag. However, it would allow the app to catalog and read files on the device without uploading them to a remote server and storing them there. As I understand it the app requests permission to access some local directory. Once granted it can scan the directory for readable files (epubs, pdfs, etc) and present them as options to the user. After that I could read the file and parse out speakable text and store it for offline use. The permission resets after the tab is closed, so it would be best to cache the result in storage that the app always has access to, and allow the user to re-read the file later on when they can deal with a re-prompt.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Tests
