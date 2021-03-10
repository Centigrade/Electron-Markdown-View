import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as fs from "fs";
import * as showdown from "showdown";
import * as markdownHtml from "./markdown-view/index.html";

export class MarkdownWindow {
  private window: BrowserWindow;
  private preventWindowAllClosedEvent: boolean;
  private markdownFile: string;
  private windowName: string;

  constructor(file: string, windowName?: string) {
    this.window = null;
    this.windowName =
      windowName == undefined ? this.getFileName(file) : windowName;
    this.markdownFile = file;

    this.preventWindowAllClosedEvent = false;
    app.on("window-all-closed", (event) => {
      if (this.preventWindowAllClosedEvent) event.preventDefault();
    });
  }

  public show() {
    // Does window already exist
    if (this.window === null) {
      //Check if other windows are open
      if (this.getNumOpenWindows() === 0) {
        this.preventWindowAllClosedEvent = true;
      }

      // Create new BrowserWindow
      this.window = new BrowserWindow({
        title: this.windowName,
        show: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
        },
      });
      this.window.removeMenu();

      // Listen to events
      this.window.once("ready-to-show", () => {
        fs.readFile(this.markdownFile, "utf8", (error, data) => {
          if (error) throw error;

          const converter = new showdown.Converter();
          const htmlVersion = converter.makeHtml(data);

          this.window.webContents.send("transmitMarkdown", htmlVersion);
        });

        this.window.show();
      });

      this.window.on("close", (event) => {
        event.preventDefault();
        this.window.destroy();
      });

      this.window.on("closed", () => this.cleanup());

      // Load View HTML
      this.window.loadURL(
        "data:text/html;charset=utf-8," + encodeURIComponent(markdownHtml)
      );
    }
  }

  public close() {
    if (this.window !== null) {
      this.window.close();
    }
  }

  private cleanup() {
    this.window = null;
    this.preventWindowAllClosedEvent = false;
  }

  private getNumOpenWindows() {
    return BrowserWindow.getAllWindows().filter((window) => {
      return window.isVisible();
    }).length;
  }

  private getFileName(url: string): string {
    let fileName = path.basename(url);
    fileName = fileName.substr(0, fileName.lastIndexOf("."));
    return fileName;
  }
}
