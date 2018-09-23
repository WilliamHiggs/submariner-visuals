
/*
* AUDIO STUFF
* most of this stuff is currently from:
* https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
* It's a good starting place!
*/

// initiate new audio context from the web audio api
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var stream;

/*
* Analyser node for visuals
* https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode
*/
var analyser = audioCtx.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;

if (navigator.mediaDevices.getUserMedia) {
  console.log('getUserMedia supported.');
  var constraints = {audio: true, video: false};
  navigator.mediaDevices.getUserMedia (constraints)
    .then(
      function(stream) {
        source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        visualize();
    })
    .catch( function(err) {
      console.log(
        'The following gUM error occured: ' +
        err +
        " See here - https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia"
      );
    })
} else {
  console.log('getUserMedia not supported on your browser!');
}

/*
* VISUAL STUFF
*/

/*
* define canvas elements
*/
var canvas = document.getElementById("overlay");
var canvasCtx = canvas.getContext("2d");

/*
* at the moment this gets a random RGB for the backgroundColor
* this should be used to define a pallet in the show eventually
* it will scroll through on peaks
*/
function getPalletRgb() {
  /*var num = Math.round(0xffffff * Math.random());
  //var r = num >> 16;
  //var g = num >> 8 & 255;
  //var b = num & 255;
  //return 'rgb(' + r + ', ' + g + ', ' + b + ', 0.5)';
  */
  var pallet = ["#FFBAD2", "#73C2FB", "#3f93bd", "#4f79bf", "#c2e8ff", "#e2deff", "#8498ff", "#eeaacc", "#ccdddd", "#ffcccc", "#eedddd"];
  return pallet[Math.floor(Math.random()*pallet.length)]
}

/*
* visualize initiates the visual elements of the canvas.
*/

function visualize() {
  var width = canvas.width;
  var height = canvas.height;

  /*
  * fftSize Is an unsigned long value representing the size of the
  * FFT (Fast Fourier Transform) to be used to determine the frequency domain.
  */
  analyser.fftSize = 2048;

  /*
  * frequencyBinCount Is an unsigned long value half that of the FFT size.
  * This generally equates to the number of data values you will have to
  * play with for the visualization.
  */
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  /*
  * Next, we clear the canvas of what had been drawn on it before to get ready
  * for the new visualization display:
  */
  canvasCtx.clearRect(0, 0, width, height);

  // We now define the draw() function:
  function draw() {

    canvasCtx.clearRect(0, 0, width, height);
    /*
    * In here, we use requestAnimationFrame() to keep looping
    * the drawing function once it has been started:
    */
    requestAnimationFrame(draw);

    // Next, we grab the time domain data and copy it into our array
    analyser.getByteTimeDomainData(dataArray);

    // Next, fill the canvas with a solid colour to start
    canvasCtx.fillStyle = "rgba(255, 255, 255)";
    canvasCtx.fillRect(100, 100, width, height);

    /*
    * Set a line width and stroke colour for the wave we will draw,
    * then begin drawing a path
    */
    canvasCtx.lineWidth = 1;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
    canvasCtx.beginPath();

    /*
    * Determine the width of each segment of the line to be drawn
    * by dividing the canvas width by the array length
    * (equal to the FrequencyBinCount, as defined earlier on),
    * then define an x variable to define the position
    * to move to for drawing each segment of the line.
    */
    var sliceWidth = width * 1.0 / bufferLength;
    var x = 0;

    /*
    * Now we run through a loop,
    * defining the position of a small segment of the wave
    * for each point in the buffer at a certain height
    * based on the data point value from the array,
    * then moving the line across to the place
    * where the next wave segment should be drawn:
    */
    for (var i = 0; i < bufferLength; i++) {
      Math.random()


      var v = dataArray[i] / 128.0;
      var y = v * height / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      if (dataArray[i] > 165) {
        canvasCtx.strokeStyle = getPalletRgb();
      }
      if (dataArray[i] > 235) {
         document.body.style.backgroundColor = getPalletRgb();
      }

      x += sliceWidth;
    }

  /*
  * Finally, we finish the line in the middle of the right hand
  * side of the canvas, then draw the stroke we've defined:
  */
  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();

  };
  /*
  * At the end of this section of code,
  * we invoke the draw() function to start off the whole process:
  */
  draw();
};
