import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass';

export const LightingSetup = (scene, camera, renderer) => {
  // === RENDERER CONFIG ===
  if (renderer) {
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.5;  // bright daylight exposure
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;
  }

  // === MAIN SUNLIGHT ===
  const sun = new THREE.DirectionalLight(0xffffff, 0);
  sun.position.set(10, 30, 10);
  sun.castShadow = true;

  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;

  const d = 60;
  sun.shadow.camera.left = -d;
  sun.shadow.camera.right = d;
  sun.shadow.camera.top = d;
  sun.shadow.camera.bottom = -d;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 100;
  sun.shadow.bias = -0.0005;
  scene.add(sun);

  // === ADDITIONAL DIRECTIONAL LIGHTS ===
  const lights = [];

  // Top light
  const topLight = new THREE.DirectionalLight(0xffffff, 10);
  topLight.position.set(0, 20, 0);
  topLight.castShadow = false;  // optional, disable shadows on extras for performance
  lights.push(topLight);

  // Left light
  const leftLight = new THREE.DirectionalLight(0xffffff, 8.5);
  leftLight.position.set(-15, 10, 0);
  leftLight.castShadow = false;
  lights.push(leftLight);

  // Right light
  const rightLight = new THREE.DirectionalLight(0xffffff,8.5);
  rightLight.position.set(15, 10, 0);
  rightLight.castShadow = false;
  lights.push(rightLight);

  // Back light
  const backLight = new THREE.DirectionalLight(0xffffff, 10.5);
  backLight.position.set(0, 10, -15);
  backLight.castShadow = false;
  lights.push(backLight);

  // Front light
  const frontLight = new THREE.DirectionalLight(0xffffff, 10.5);
  frontLight.position.set(0, 10, 15);
  frontLight.castShadow = false;
  lights.push(frontLight);

  lights.forEach(light => scene.add(light));

  // === AMBIENT LIGHT ===
  const ambient = new THREE.AmbientLight(0xffffff, 8.8);
  scene.add(ambient);

  // === SHADOW RECEIVER GROUND PLANE ===
  const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.ShadowMaterial({ opacity: 0.3 })
  );
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = 2;
  shadowPlane.receiveShadow = true;
  scene.add(shadowPlane);

  // === POST PROCESSING ===
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.kernelRadius = 9;
  ssaoPass.minDistance = 0.01;
  ssaoPass.maxDistance = 0.2;
  composer.addPass(ssaoPass);

  const filmPass = new FilmPass(1.25, 0.11, 98, false);
  composer.addPass(filmPass);

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.1,
    0.2,
    0.8
  );
  composer.addPass(bloomPass);
  
  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
rimLight.position.set(-5, 5, -5); // behind and to the side
scene.add(rimLight);


  return composer;
};
