const { ipcRenderer } = require("electron");

window.onload = function () {
  ipcRenderer.on("transmitMarkdown", (event, data) => {
    document.getElementById("md-container").innerHTML = data;
  });
};
