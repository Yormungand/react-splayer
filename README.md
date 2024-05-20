# ReactSplayer

ReactSplayer is a customizable React component for playing video files. It supports multiple video sources and offers
easy integration into your React projects.

---

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
import ReactSplayer from "@yormungandr/react-splayer";
```

```javascript
import React from 'react';
import ReactSplayer from "@yormungandr/react-splayer";
import 'react-splayer/dist/splayer.css';

function App() {
    const videoSources = [
        {src: 'video.mp4', type: 'video/mp4'},
        {src: 'video.webm', type: 'video/webm'}
    ];

    return (
        <div>
            <h1>My Video Player</h1>
            <ReactSplayer
                sources={videoSources}
                loadstart={e => {
                }}
            />
        </div>
    );
}

export default App;

```

## Props

---

The ReactSplayer component accepts the following props:

| Prop name       |                                                   description                                                    | default value |                           Example value                            |
|-----------------|:----------------------------------------------------------------------------------------------------------------:|:-------------:|:------------------------------------------------------------------:|
| sources         |                                             Source of video to play                                              |      [ ]      | [{src: "video source uri here", type: "video/mp4", label: "720" }] |
| videoTitle      |                                              Title shown on player                                               |      ""       |                        "Chapter 1: Example"                        |
| fullscreenAuto  |                                If `true` player will automatically go fullscreen                                 |     false     |                                true                                |
| backNavigation  |                 Must be function, function is fired when user clicks on back button(arrow left)                  |     null      |           () => {console.log("Clicked on back button")}            |
| episodes        |           Is a number value if chosen video has more than 1 episode it will episodes button on player            |       1       |                                 15                                 |
| onClickEpisodes | This function prop is used only if `episodes` is more than 1 to fire a function when episodes button is clicked. |   () => {}    |             () => {console.log("Clicked on episodes")}             |

- `sources`: An array of objects representing the video sources. Each object should have the properties:
    - `src`: The URL of the video file.
    - `type`: The MIME type of the video file (e.g., video/mp4).
    - `label`: quality label of video file (e.g., '480p' or '720p').

## Events

---

| Event name     | Fired when                                                                                                                                                                  |
|----------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| canplay        | The browser can play the media, but estimates that not enough data has been loaded to play the media up to its end without having to stop for further buffering of content. |
| canplaythrough | The browser estimates it can play the media up to its end without stopping for content buffering.                                                                           |
| durationchange | The `duration` attribute has been updated.                                                                                                                                  |
| emptied        | The media has become empty; for example, this event is sent if the media has already been loaded (or partially loaded), and the `load()` method is called to reload it.     |
| ended          | Playback has stopped because the end of the media was reached.                                                                                                              |
| error          | An error occurred while fetching the media data, or the type of the resource is not a supported media format.                                                               |
| loadeddata     | The first frame of the media has finished loading.                                                                                                                          |
| loadedmetadata | The metadata has been loaded.                                                                                                                                               |
| loadstart      | Fired when the browser has started to load the resource.                                                                                                                    |
| pause          | Playback has been paused.                                                                                                                                                   |
| play           | Playback has begun.                                                                                                                                                         |
| playing        | Playback is ready to start after having been paused or delayed due to lack of data.                                                                                         |
| progress       | Fired periodically as the browser loads a resource.                                                                                                                         |
| ratechange     | The playback rate has changed.                                                                                                                                              |
| seeked         | A seek operation completed.                                                                                                                                                 |
| seeking        | A seek operation began.                                                                                                                                                     |
| stalled        | The user agent is trying to fetch media data, but data is unexpectedly not forthcoming.                                                                                     |
| suspend        | Media data loading has been suspended.                                                                                                                                      |
| timeupdate     | The time indicated by the `currentTime` attribute has been updated.                                                                                                         |
| volumechange   | The volume has changed.                                                                                                                                                     |
| waiting        | Playback has stopped because of a temporary lack of data.                                                                                                                   |
