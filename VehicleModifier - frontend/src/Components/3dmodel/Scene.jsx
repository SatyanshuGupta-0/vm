import React, { useEffect, useRef, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import ModelLoader from './ModelLoader';
import PartManager from './PartManager';
import ColorManager from './ColorManager';
import { postData } from "../../utils/api";

const Scene = forwardRef((props, ref) => {
  const { model, userId } = props;
  const carModelId = props.carModelId || localStorage.getItem("carModelId");
  const size = { width: window.innerWidth, height: 500 };

  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000));
  const rendererRef = useRef(null);
  const currentModelRef = useRef(null);
  const currentAlloyRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [showAllAlloy, setShowAllAlloy] = useState(false);
  const [colorPartName, setColorPartName] = useState('chassis_primary_0');
  const [loading, setLoading] = useState(false);

  const alloy = [
    { url: '/tiresemple2.glb', name: 'BMW', img: '/EBKMA-STREET-18-10.5-WHEELS-LENSO-90-Z-Photoroom.png' },
    { url: '/pl8.glb', name: 'Scorpio', img: '/OIP-Photoroom.png' },
    { url: '/pl9.glb', name: 'Scorpio', img: '/OIP-Photoroom.png' },
    { url: 'https://res.cloudinary.com/dcr50hkyy/raw/upload/v1749536095/bxjtuzycn7e9o5gj2gzn.glb', name: 'Scorpio', img: '/OIP-Photoroom.png' },
    { url: 'https://res.cloudinary.com/dcr50hkyy/raw/upload/v1749536095/bxjtuzycn7e9o5gj2gzn.glb', name: 'Scorpio', img: '/OIP-Photoroom.png' },
  ];

  const createShadowCatcher = (scene, groundY = 0) => {
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(planeGeo, shadowMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = groundY;
    ground.receiveShadow = true;
    scene.add(ground);
  };

  const adjustModelToGround = (model) => {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const center = new THREE.Vector3();
    box.getCenter(center);

    model.position.x -= center.x;
    model.position.z -= center.z;

    const groundOffset = box.min.y;
    model.position.y -= groundOffset;

    createShadowCatcher(sceneRef.current, 0);
  };

  const loadGLBEnvironment = (scene) => {
    const loader = new GLTFLoader();
    loader.load("/", (gltf) => {
      const envScene = gltf.scene;
      envScene.traverse((child) => {
        if (child.isMesh) {
          child.receiveShadow = false;
          child.castShadow = false;
          child.material.envMapIntensity = 0.3;
        }
      });
      envScene.scale.set(4.5, 4.5, 5);
      envScene.position.set(0, -0.17, 0);
      scene.add(envScene);
    });
  };

  const loadHDRI = (scene, renderer) => {
  new RGBELoader()
    .setPath('/')
    .load('abandoned_tank_farm_01_4k.exr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;

      // ✅ Set environment lighting
      scene.environment = texture;

      // ❌ Do not use `map: texture` — HDRs aren't compatible that way
      // ✅ Use `envMap` for reflection and shader projection
      const material = new THREE.MeshBasicMaterial({
        envMap: texture,
        envMapIntensity: 1,
        side: THREE.BackSide,
      });

      const geometry = new THREE.SphereGeometry(100, 64, 64);
      const dome = new THREE.Mesh(geometry, material);
      scene.add(dome);

      // ✅ Proper renderer setup for HDR
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
    });
};


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      canvas,
      precision: 'highp',
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size.width, size.height);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.8;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.physicallyCorrectLights = true;

    rendererRef.current = renderer;

    const camera = cameraRef.current;
    camera.position.set(65, 15, 15);
    camera.updateProjectionMatrix();

    const scene = sceneRef.current;
    scene.background = null;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(10, 20, -10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 30;
    directionalLight.shadow.camera.left = 20;
    directionalLight.shadow.camera.right = -30;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    loadGLBEnvironment(scene);
    loadHDRI(scene, renderer);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 2;

    if (ref) {
      ref.current = { scene, camera, renderer };
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const width = window.innerWidth;
      const height = 500;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', onResize);

    return () => {
      controls.dispose();
      renderer.dispose();
      scene.clear();
      window.removeEventListener('resize', onResize);
    };
  }, [ref]);

  useEffect(() => {
    if (model && sceneRef.current) {
      ModelLoader.loadModel(model, sceneRef.current, currentModelRef, setLoading);

      const setupModel = () => {
        if (!currentModelRef.current) return;
        currentModelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        adjustModelToGround(currentModelRef.current);
      };

      const timer = setTimeout(setupModel, 1500);
      const timerRemoveAlloy = setTimeout(() => {
        removePart('alloy_1', 'all.gltf');
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(timerRemoveAlloy);
      };
    }
  }, [model]);
  const removePart = async (partName, newPartURL) => {
    setLoading(true);
    try {
      const model = currentModelRef.current;
      const scene = sceneRef.current;

      if (model && scene) {
        await PartManager.loadAndReplacePart(model, scene, partName, newPartURL, currentAlloyRef);
        PartManager.removePart(model, partName);

        const newPart = model.getObjectByName(partName);
        if (newPart) {
          const box = new THREE.Box3().setFromObject(newPart);
          const center = new THREE.Vector3();
          box.getCenter(center);
          const rotation = newPart.rotation;

          await postData('/api/carpart/save', {
            userId,
            carModelId,
            type: 'part',
            part: partName,
            value: newPartURL,
            position: { x: center.x, y: center.y, z: center.z },
            rotation: { x: rotation.x, y: rotation.y, z: rotation.z }
          });
        }
      }
    } catch (error) {
      console.error('Error replacing part:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleColorChange = async (event) => {
    const color = event.target.value;
    setSelectedColor(color);
    setLoading(true);

    try {
      const model = currentModelRef.current;
      const part = model?.getObjectByName(colorPartName);

      if (part) {
        ColorManager.changeColor(model, colorPartName, color);
        part.traverse((child) => {
          if (child.isMesh) {
            child.material.color.set(color);
          }
        });

        const box = new THREE.Box3().setFromObject(part);
        const center = new THREE.Vector3();
        box.getCenter(center);
        const rotation = part.rotation;

        await postData('/api/carpart/save', {
          userId,
          carModelId,
          type: 'color',
          part: colorPartName,
          value: color,
          position: { x: center.x, y: center.y, z: center.z },
          rotation: { x: rotation.x, y: rotation.y, z: rotation.z }
        });
      }
    } catch (error) {
      console.error('Error applying color:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAlloysVisibility = () => {
    setShowAllAlloy((prev) => !prev);
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-auto w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Alloy switcher */}
      <div className="absolute top-14 left-4 z-10">
        <div onClick={toggleAlloysVisibility} className="cursor-pointer">
          <div className='h-10 w-10 border-2 border-opacity-0 border-black rounded-full'></div>
        </div>

        {showAllAlloy &&
          alloy.map((alloyinfo, index) => (
            <div key={index} onClick={() => removePart('alloy_1', alloyinfo.url)} className="my-2 cursor-pointer">
              <img className="h-9 w-9" src={alloyinfo.img} alt={alloyinfo.name} />
              <span className="text-white text-xs">{alloyinfo.name}</span>
            </div>
          ))}
      </div>

      {/* Color picker */}
      <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
        <div
          className="w-9 h-9 rounded-full border-2 border-white cursor-pointer"
          style={{ backgroundColor: selectedColor }}
          onClick={() => document.getElementById('colorPicker').click()}
        />
        <input
          type="color"
          id="colorPicker"
          value={selectedColor}
          onChange={handleColorChange}
          className="hidden"
        />
      </div>

      <canvas
        className="-ml-10"
        ref={canvasRef}
        style={{ display: 'block', margin: '0 auto' }}
      />
    </>
  );
});

export default Scene;
