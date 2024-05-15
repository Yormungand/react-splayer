# ReactSplayer

ReactSplayer is a customizable React component for playing video files. It supports multiple video sources and offers easy integration into your React projects.

## Features

- Supports multiple video sources
- Customizable player settings
- Easy to integrate and use

## Installation

You can install the package via npm:

```bash
npm install react-splayer
```

First, you need to import the ReactSplayer component and its associated CSS file.
```javascript
import ReactSplayer from 'react-splayer';
import 'react-splayer/dist/splayer.css';
```


```javascript
import React from 'react';
import ReactSplayer from 'react-splayer';
import 'react-splayer/dist/splayer.css';

function App() {
    const videoSources = [
        { src: 'video.mp4', type: 'video/mp4' },
        { src: 'video.webm', type: 'video/webm' }
    ];

    return (
        <div>
            <h1>My Video Player</h1>
            <ReactSplayer sources={videoSources} />
        </div>
    );
}

export default App;

```

# Props

---

The ReactSplayer component accepts the following props:

- `sources`: An array of objects representing the video sources. Each object should have the properties:
    - `src`: The URL of the video file.
    - `type`: The MIME type of the video file (e.g., video/mp4).
