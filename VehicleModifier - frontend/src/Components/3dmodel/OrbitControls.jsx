import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const OrbitControlsSetup = (camera, domElement) => {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.1;
  controls.rotateSpeed = 0.5; // Reduce rotation speed
  controls.panSpeed = 0.5; // Reduce panning speed

  controls.minDistance = 2; // Prevent zooming too close
  controls.maxDistance = 10; // Prevent zooming too far
  return controls;
};
