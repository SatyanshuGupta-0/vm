import React, { useState } from 'react';
import Scene from './Scene';
import { RiArrowDropDownLine } from "react-icons/ri";
function Appy() {
  const [model, setModel] = useState(null);

  const loadModel = (modelUrl) => {
    setModel(modelUrl);
  };

  let cars = [
    {
      url: "/bmw62.glb",
      name: "BMW",
      img: "/OIP-Photoroom.png",
    },
    {
      url: "/car4.glb",
      name: "Scorpio",
      img: "/OIP-Photoroom.png",
    },
    {
      url: "/jeep5.glb",
      name: "jeep",
      img: "/OIP-Photoroom.png",
    },
    {
      url: "/fortuner.glb",
      name: "fortuner",
      img: "/OIP-Photoroom.png",
    }
  ]
const [image, setimage]=useState(cars.img);

const imageLink=(linkimage)=>{
  setimage(linkimage)
}

  const [value, setvalue] = useState(false)
  const showAllCar = (value) => {
    if (value === true) {
      setvalue(false)
    }
    else {
      setvalue(true)
    }

  }
  return (

  );
}

export default Appy;


import React, { useEffect, useRef, forwardRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControlsSetup } from './OrbitControls';
import { LightingSetup } from './Lighting';
import ModelLoader from './ModelLoader';
import PartManager from './PartManager';
import ColorManager from './ColorManager';
import { select } from 'three/src/nodes/TSL.js';
import { useMemo } from 'react';
import Dropdown from './Dropdown';

const Scene = forwardRef((props, ref) => {
  const { model } = props;
  const size = { width: window.innerWidth, height: 500 };
  const canvasRef = useRef(null);
  const sceneRef = useRef(new THREE.Scene());
  const cameraRef = useRef(new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000));
  const rendererRef = useRef(null);
  const currentModelRef = useRef(null);

  const [selectedColor, setSelectedColor] = useState('#ffffff');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, powerPreference: 'high-performance' });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(size.width, size.height);
    renderer.shadowMap.enabled = true; // Enable shadows
    rendererRef.current = renderer;

    let targetFPS = 30; // Default FPS for desktops
    if (/Android|iPhone/i.test(navigator.userAgent)) {
      targetFPS = 15; // Lower FPS for mobile devices
    }
    const interval = 1000 / targetFPS;

    function renderLoop() {
      setTimeout(() => {
        requestAnimationFrame(renderLoop); // Keep the loop going
      }, interval);
    }
    const camera = cameraRef.current;
    camera.position.set(0, 4.5, -9);

    const scene = sceneRef.current;
    scene.background = new THREE.Color('grey');

    // Lighting and controls
    LightingSetup(scene);
    const controls = OrbitControlsSetup(camera, renderer.domElement);

    if (ref) {
      ref.current = { scene, camera, renderer };
    }


    // Animation loop
    let isRunning = true;
    const animate = (time) => {

      if (!isRunning) return;
      requestAnimationFrame(animate);
      controls.update();
      if (camera.position.y < 1) {
        camera.position.y = 1;
      }
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      isRunning = false;
      controls.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Handle model loading and part removal with optimized loading
  useEffect(() => {

    if (model && sceneRef.current) {
      ModelLoader.loadModel(model, sceneRef.current, currentModelRef);
    }
  }, [model]);
  
    const removePart = (partName, newPartURL) => {
      if (currentModelRef.current) {
        const model = currentModelRef.current;
        const scene = sceneRef.current;
        
        // Replace the part and its eligible children using PartManager
        PartManager.loadAndReplacePart(model, scene, partName, newPartURL);
        PartManager.removePart(modelvurl, partName);
      } else {
        console.error('Model or scene reference is missing.');
      }
    }



  const [colorpartname , setcolorpartname]=useState("chassis_primary_0")

  const selectName =(value)=>{
    setcolorpartname(value)
  }

  const handleColorChange = (event) => {
    const color = event.target.value;
    setSelectedColor(color);

    if (currentModelRef.current) {
      const parentObject = currentModelRef.current.getObjectByName(colorpartname);

      if (parentObject) {
        // Change the color of the parent
        ColorManager.changeColor(currentModelRef.current, colorpartname, color);

        parentObject.traverse((child) => {
          if (child.isMesh) {
            child.material.color.set(color); // Update the color of the child mesh
          }
        });
      } else {
        console.warn('Parent object "chassis_primary_0" not found in the model.');
      }
    }
  };
const [dropDownAllAlloys ,setDropDownAllAlloys]=useState(false)
const showAllAlloys=()=>{
  setDropDownAllAlloys(perv => { return perv ? false : true})
}
  // Render the scene and interaction buttons
  return (
    <>
    <div onClick={showAllAlloys} className='h-10 w-10'>
           <div onClick={() => removePart('alloy_1', '/vvm251purple.glb')}>
        <img
          className='h-9 w-9 mx-1 mb-2'
          src='/EBKMA-STREET-18-10.5-WHEELS-LENSO-90-Z-Photoroom.png'
          alt=''
        />
      </div>
           <div onClick={() => removePart('alloy_1', '/vvm251.glb')}>
        <img
          className='h-9 w-9 mx-1 mb-2'
          src='/EBKMA-STREET-18-10.5-WHEELS-LENSO-90-Z-Photoroom.png'
          alt=''
        />
      </div>
      </div>
      {dropDownAllAlloys ? <Dropdown /> : null }
      <div>
        <canvas ref={canvasRef} style={{ display: 'block', margin: '0 auto' }} />

        <div className="flex items-center mt-9 ">
          {/* Color Display Box (Always Visible) */}
          <div
            className="w-9 h-9 mx-1 rounded-full border-2 border-black cursor-pointer"
            style={{ backgroundColor: selectedColor }}
            onClick={() => document.getElementById("colorPicker").click()} // Trigger the hidden input
          ></div>

          {/* Hidden Color Picker Input */}
          <input
            type="color"
            id="colorPicker"
            value={selectedColor}
            onChange={handleColorChange}
            className="hidden self-jusitfy-center" // Hide the input
          />
        </div>
      </div>
      <div onClick={()=>selectName("chassis_primary_0")}>Exterior</div>
      <div onClick={()=>selectName("scorpio_n_int_seats_scorpio_n_int_dashboard6_0")}>Interior</div>
      <div onClick={()=>selectName("scorpio_n_int_roof_scorpio_n_int_sidewall7_0")}>roof</div>
      <div onClick={()=>selectName("sunroof_m_sunroof_m1_0")}>sunroof</div>
      <div onClick={()=>selectName("windscreen_glass_0")}>tinted</div>
    </>
  );
});

export default Scene;


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


// ModelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelLoader = {
  loadModel: (modelUrl, scene, currentModelRef) => {
    const loader = new GLTFLoader();

    if (currentModelRef.current) {
      scene.remove(currentModelRef.current);
      currentModelRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      currentModelRef.current = null;
    }

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1, 1, 1);
        model.position.set(0, 0, 0);
        scene.add(model);
        currentModelRef.current = model;
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  },
};

export default ModelLoader;



// ColorManager.js
const ColorManager = {
    changeColor: (model, partName, color) => {
      const part = model.getObjectByName(partName);
      if (part && part.isMesh) {
        part.material.color.set(color);
        console.log(`Changed color of ${partName} to ${color}`);
      } else {
        console.error(`Part ${partName} not found or is not a mesh.`);
      }
    },
  };
  
  export default ColorManager;


  import * as THREE from 'three';
  
  export const LightingSetup = (scene) => {
  
  
    const stageGeometry = new THREE.PlaneGeometry(20, 20); // Size of the stage
  const stageMaterial = new THREE.MeshStandardMaterial({ // Apply road texture
    color : "black",
    roughness: 0.8,
  });
  const stage = new THREE.Mesh(stageGeometry, stageMaterial);
  stage.rotation.x = -Math.PI / 2; // Rotate to lie flat 
  stage.receiveShadow = true; // Enable shadow receiving
  scene.add(stage);
    
    const circleGeometry = new THREE.CircleGeometry(6, 64); // Radius 3, 64 segments
    const circleMaterial = new THREE.MeshStandardMaterial({
      color: "black" , // Metallic color
      metalness: 1,
      roughness: 0.2,
    });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.rotation.x = -Math.PI / 2; // Rotate to lie flat
    circle.position.y = 0.01; // Slightly above the stage
    circle.castShadow = true; // Enable shadow casting
    scene.add(circle);
  
  // // Sunlight (DirectionalLight)
  const sunlight = new THREE.DirectionalLight(0xffffff, 1.2); // Bright white sunlight
  sunlight.position.set(10, 20, 10); // Position of the sun in the sky
  sunlight.castShadow = true; // Enable shadows
  
  // Shadow settings
  sunlight.shadow.mapSize.width = 1024; // Shadow quality
  sunlight.shadow.mapSize.height = 1024;
  sunlight.shadow.camera.near = 1;
  sunlight.shadow.camera.far = 50;
  sunlight.shadow.camera.left = -10;
  sunlight.shadow.camera.right = 10;
  sunlight.shadow.camera.top = 10;
  sunlight.shadow.camera.bottom = -10;
  
  scene.add(sunlight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3); // Uniform soft light
    scene.add(ambientLight);
  
    // Directional Lights
    const frontLight = new THREE.DirectionalLight(0xffffff,0.5);
    frontLight.position.set(0, 10, 10);
    frontLight.castShadow = true;
    scene.add(frontLight);
  
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 10, -10);
    backLight.castShadow = true;
    scene.add(backLight);
  
    const sideLightLeft = new THREE.DirectionalLight(0xffffff, 0.8);
    sideLightLeft.position.set(-10, 10, 0);
    sideLightLeft.castShadow = true;
    scene.add(sideLightLeft);
  
    const sideLightRight = new THREE.DirectionalLight(0xffffff, 0.8);
    sideLightRight.position.set(10, 10, 0);
    sideLightRight.castShadow = true;
    scene.add(sideLightRight);
  
    // Point Lights
    const pointLight1 = new THREE.PointLight(0xffffff, 0.6, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
  
    const pointLight2 = new THREE.PointLight(0xffffff, 0.6, 50);
    pointLight2.position.set(-5, 5, -5);
    scene.add(pointLight2);
  
  };
  

  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  
  const PartManager = {
    // Remove a part from the model by name
    removePart: (model, partName) => {
      const part = model.getObjectByName(partName);
      if (part) {
        const childrenData = [];
  
        part.traverse((child) => {
          if (child.isMesh && !child.name.startsWith('wheel')) {
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
  
            child.getWorldPosition(worldPosition);
            child.getWorldQuaternion(worldQuaternion);
            child.getWorldScale(worldScale);
  
            childrenData.push({
              name: child.name,
              worldPosition,
              worldQuaternion,
              worldScale,
            });
  
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
              if (child.material.map) child.material.map.dispose();
              if (child.material.bumpMap) child.material.bumpMap.dispose();
              if (child.material.normalMap) child.material.normalMap.dispose();
              child.material.dispose();
            }
          }
        });
  
        if (part.parent) {
          part.parent.remove(part);
        }
  
        console.log(`Removed part: ${partName}`);
        return childrenData;
      } else {
        console.log(`Part ${partName} not found`);
        return null;
      }
    },
  
    // Load and replace a part in the model
    loadAndReplacePart: (model, scene, oldPartName, newPartURL) => {
      const loader = new GLTFLoader();
  
      // Ensure the old part is removed before loading a new one
      const childrenData = PartManager.removePart(model, oldPartName);
  
      if (childrenData) {
        console.log(`Loading new part for: ${oldPartName}`);
        loader.load(
          newPartURL,
          (gltf) => {
            const newPart = gltf.scene.children[0];
  
            // Add the new part based on the removed part's data
            childrenData.forEach((data) => {
              const clonedPart = newPart.clone();
  
              clonedPart.position.copy(data.worldPosition);
              clonedPart.quaternion.copy(data.worldQuaternion);
              clonedPart.scale.copy(data.worldScale);
              clonedPart.name = data.name; // Keep the same name for consistency
  
              const parent = model.getObjectByName(oldPartName)?.parent;
              if (parent) {
                parent.add(clonedPart);
              } else {
                scene.add(clonedPart);
              }
  
              console.log(`Replaced ${data.name}`);
            });
          },
          (progress) => {
            console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`);
          },
          (error) => {
            console.error(`Error loading part: ${error.message}`);
          }
        );
      } else {
        console.log(`No part found to remove: ${oldPartName}`);
      }
    },
  };
  
  export default PartManager;
  

  const Dropdown = () => {
    return (
        <>
            <div className="flex items-center justify-center mb-10">
                <div className="h-96 w-72 bg-white grid grid-cols-1 items-center">
                    <div className="border-b-black h-20 w-full self-start bg-black text-white flex">
                        <p className="text-center p-1">BRAND
                            <div className="border-2 border-white rounded-lg h-10 w-40">
                            </div>
                        </p>
                        <p className="text-center p-1">SIZE
                            <div className="border-2 border-white rounded-lg h-10 w-10">
                            </div>
                        </p>

                    </div>
                    <div className="border-b-black h-20 w-full bg-red-600"></div>
                </div>
            </div>
        </>
    )
}

export default Dropdown;


