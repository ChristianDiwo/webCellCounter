// Set constraints for the video stream
const constraints = { 
  video: {
    deviceId: { 
      exact: "",
      ideal: ""
    },
    frameRate: { ideal: 15, max: 15 },
    width: { ideal: 640, max: 640 },
    height: { ideal: 480, max: 480 }
  }, 
  audio: false 
};
// Define constants
const cameraView = document.querySelector("#camera--view");
cameraView.style.transform = 'scaleX(-1)';
const cameraOutput = document.querySelector("#camera--output");
const cameraSensor = document.querySelector("#camera--sensor");
const cameraTrigger = document.querySelector("#camera--trigger");
const worker = new Worker('worker.js');

async function getBackCamera() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const backCamera = devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'));

  if (backCamera) {
    constraints.video.deviceId.exact = backCamera.deviceId;
    return true;
  } else {
    console.error("Could not find back camera");
    return false;
  }
}

async function cameraStart() {
  const hasBackCamera = await getBackCamera();
  if (hasBackCamera) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      track = stream.getTracks()[0];
      cameraView.srcObject = stream;
    } catch (error) {
      console.error("Oops. Something is broken.", error);
    }
  }
}

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
  cameraSensor.width = cameraView.videoWidth;
  cameraSensor.height = cameraView.videoHeight;
  cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
  cameraOutput.src = cameraSensor.toDataURL("image/webp");
  cameraOutput.classList.add("taken");
};

window.addEventListener("load", cameraStart, false);

worker.addEventListener('message', (event) => {
  const processedImageData = event.data;
  
  // Display the processed image data on the canvas
  const context = photo_holder.getContext('2d');
  context.putImageData(processedImageData, 0, 0);
});