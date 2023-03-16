// Set constraints for the video stream
const constraints = { 
  video: {
    facingMode: "user",
    frameRate: { ideal: 15, max: 15 },
    width: { ideal: 640, max: 640 },
    height: { ideal: 480, max: 480 }
  }, 
  audio: false 
};
// Define constants
const constraints = { video: { facingMode: "user" }, audio: false };
const cameraView = document.querySelector("#camera--view");
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");

async function cameraStart() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    track = stream.getTracks()[0];
    cameraView.srcObject = stream;
  } catch (error) {
    console.error("Oops. Something is broken.", error);
  }
}

window.addEventListener("load", cameraStart, false);