
// initiate new audio context from the web audio api onClick to satisfy Google Chrome
document.querySelector('html').addEventListener('click', function() {

  var audioCtx = new (window.AudioContext || window.webkitAudioContext)(),
      source,
      stream,
      overlay_video = document.getElementById("overlay_video"),
      analyser = audioCtx.createAnalyser();

  analyser.minDecibels = -70;
  analyser.maxDecibels = -5;
  analyser.smoothingTimeConstant = 0.9;

  if (navigator.mediaDevices.getUserMedia) {
    console.log('getUserMedia supported.');
    var constraints = {audio: true, video: false};
    navigator.mediaDevices.getUserMedia(constraints)
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


  var canvas = document.getElementById("overlay"),
      canvasCtx = canvas.getContext("2d");

  function getRandomPallete() {
    var pallete = ["#F6C89B", "#F6C3D7", "#89CFF0", "#D03737"];
    return pallete[Math.floor(Math.random()*pallete.length)]
  }

  function RingBuffer(maxLength) {
    this.maxLength = maxLength;
  }

  RingBuffer.prototype = Object.create(Array.prototype);

  RingBuffer.prototype.push = function(element) {
    Array.prototype.push.call(this, element);
    while (this.length > this.maxLength) {
      this.shift();
    }
  }

  const average = arr => arr.reduce((a,b) => a + b) / arr.length;

  var maxPeak = 255,
      minPeak = 245,
      threshold = minPeak,
      peakArray = new RingBuffer(128);

  peakArray.forEach(x => x = minPeak);


  function visualize() {
    var width = canvas.width,
        height = canvas.height;

    analyser.fftSize = 2048;

    var bufferLength = analyser.frequencyBinCount,
        dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, width, height);

    function draw() {

      canvasCtx.clearRect(0, 0, width, height);

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgba(255, 255, 255)";
      canvasCtx.fillRect(100, 100, width, height);

      canvasCtx.lineWidth = 1;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      overlay_video.style.filter = "opacity(0%)";


      var sliceWidth = width * 1.0 / bufferLength,
          x = 0;


      for (var i = 0; i < bufferLength; i++) {

        var randomColour = getRandomPallete(),
            v = dataArray[i] / 128.0,
            y = v * height / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        if (dataArray[i] > threshold - 75) {
          canvasCtx.strokeStyle = randomColour;
        }

        if (dataArray[i] < maxPeak && dataArray[i] > threshold) {

          peakArray.push(dataArray[i]);

          threshold = Math.floor(average(peakArray));

          document.body.style.backgroundColor = randomColour;

          overlay_video.style.filter = "opacity(100%)";

        } else {

          if (threshold > minPeak) threshold = threshold - 0.01;

        }

        x += sliceWidth;
      }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();

    };

    draw();
  };
});
