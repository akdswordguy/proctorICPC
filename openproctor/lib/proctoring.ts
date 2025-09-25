import { StreamUploader } from './streamUploader';

export async function startProctoring({ onStarted, onStopped }: { onStarted?: () => void, onStopped?: () => void }) {
  // Ask for permissions
  const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
  const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

  // Initialize uploader
  const uploader = new StreamUploader({
    videoStream: cameraStream,
    audioStream: audioStream,
    screenStream: screenStream, // Not used for now
    serverUrl: 'http://localhost:5000/upload',
  });

  uploader.init();
  uploader.start();

  if (onStarted) onStarted();

  // Return a stop function
  return () => {
    uploader.stop();
    if (onStopped) onStopped();
  };
}
