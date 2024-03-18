# Usage

---

```javascript
import ReactSplayer from "ReactSplayer";

const sources = [
    {
        "sources" : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        "thumb" : "video/mp4",
        "label" : "720"
    },
    {
        "src" : "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        "type" : "video/mp4",
        "label" : "480"
    },
]

return (
    <ReactSplayer
        title="React Splayer"
        sources={sources}
    />
)

```

# Props

---

| Name           |   Type    | Default value |
|----------------|:---------:|--------------:|
| fullscreenAuto | `boolean` |       `false` |
| title          | `String`  |          `""` |
| sources        |  `Array`  |          `[]` |
