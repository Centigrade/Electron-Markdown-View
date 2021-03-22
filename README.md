# electron-markdown-view

Offers an out-of-the-box window solution in electron to display static markdown files.



## Installation

```sh
npm install electron-markdown-view
```



## Usage

First, require the "electron-markdown-view" package and create an instance of
MarkdownWindow, passing the .md file location to the constructor.

```javascript
const mdView = require("electron-markdown-view");
const mdWindow = new mdView.MarkdownWindow("path/to/markdown.md");
```

Or in Typescript:

```javascript
import { MarkdownWindow } from "electron-markdown-view";
const mdWindow = new MarkdownWindow("path/to/markdown.md");
```

Afterwards you can open the window with the .show() function.

```javascript
mdWindow.show();
```

Alternatively, you can call the constructor with an optional title for the window:

```javascript
const mdWindow = new mdView.MarkdownWindow("path/to/markdown.md", "WindowTitle");
```

If no title for the window is passed to the constructor, the name of the markdown file without
the file extension will be taken instead (i.e. "markdown" in the example).

If you want to close the window, call:

```javascript
mdWindow.close();
```



## Behavior

The package tries to leave the intended window behavior untouched, i.e.:

- If electron runs a *tray application* and the markdown window is opened (i.e. no other windows were open at that time), it will **NOT** quit the application on close (it prevents the '[window-all-closed](https://www.electronjs.org/docs/api/app#event-window-all-closed)' default behavior).
- If other windows are already open and the markdown window is opened, the window will assume that the developer has pre-defined the intended window behavior and will not interfere with it (it does not prevent the '[window-all-closed](https://www.electronjs.org/docs/api/app#event-window-all-closed)' default behavior) .



## License

[MIT](https://github.com/Centigrade/Electron-Markdown-View/blob/master/LICENSE.md)
