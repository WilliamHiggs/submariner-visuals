/*
** Background.js
** loads in video for the background of the visuals
*/
/*
const fs = require("fs");
const videoArray = [];

fs.readdir("./media", (err, files) => {
  for (let i = 0; i < files.length; i++) {
    videoArray.push(files[i]);
  }
});
*/

var videoSource = ["IMG_1655.MOV", "IMG_1656.MOV", "IMG_1658.MOV", "IMG_1746.MOV", "IMG_1800.MOV", "IMG_1807.MOV", "IMG_1812.MOV", "IMG_1815.MOV", "IMG_1816.MOV", "IMG_1844.MOV", "IMG_1846.MOV", "IMG_1855.MOV", "IMG_1856.MOV", "IMG_1861.MOV", "IMG_1975.MOV"];
var videoEl = document.getElementById('background_video');
var nextSource = videoSource[0];
var index = 0;
videoEl.src = "media/" + nextSource;

videoEl.addEventListener('ended', function(e) {

  if (index === videoSource.length - 1) {
    index = 0;
    nextSource = videoSource[0];
  } else {
    index++;
    nextSource = videoSource[index];
  }
  // update the video source and play
  videoEl.src = "media/" + nextSource;
  videoEl.play();
});
