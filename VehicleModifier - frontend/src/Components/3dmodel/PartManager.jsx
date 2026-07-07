// import * as THREE from 'three';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// const PartManager = {
//   savedPartsData: {},
//   clonedParts: {},

//   // Remove a part from the model by name
//   removePart: (model, partName) => {
//     const part = model.getObjectByName(partName);
//     const childrenData = [];
//     if (part) {
//       part.traverse((child) => {

//         if (child.isMesh && !child.name.startsWith('wheel')) {

          
//           const worldPosition = new THREE.Vector3();
//           const worldQuaternion = new THREE.Quaternion();
//           const worldScale = new THREE.Vector3();

//           child.getWorldPosition(worldPosition);
//           child.getWorldQuaternion(worldQuaternion);
//           child.getWorldScale(worldScale);

//           childrenData.push({
//             name: child.name,
//             worldPosition,
//             worldQuaternion,
//             worldScale,
//           });

//           // Dispose of geometries and materials
//           child.geometry?.dispose();
//           if (child.material) {
//             child.material.map?.dispose();
//             child.material.bumpMap?.dispose();
//             child.material.normalMap?.dispose();
//             child.material.dispose();
//           }
//         }
//       });

//       if (part.parent) {
//         part.parent.remove(part);
//         console.log(`Removed part: ${partName}`);
//       } else {
//         console.warn(`Part ${partName} has no parent and couldn't be removed.`);
//       }

//       // Save childrenData for later use
//       PartManager.savedPartsData[partName] = childrenData;

//       return childrenData;
//     } else {
//       console.log(`Part ${partName} not found`);
//       return null;
//     }
//   },

//   // Remove old clones for a specific partName
//   removeOldClones: (scene, partName) => {
//     if (PartManager.clonedParts[partName]) {
//       PartManager.clonedParts[partName].forEach((clonedPart) => {
//         scene.remove(clonedPart);
//         clonedPart.traverse((child) => {
//           if (child.isMesh) {
//             child.geometry?.dispose();
//             child.material?.dispose();
//           }
//         });
//       });
//       PartManager.clonedParts[partName] = [];
      
//       // Clear the references
//       console.log(`Removed old clones for part: ${partName}`);
//     } else {
//       console.log(`No clones found for part: ${partName}`);
//     }
//   },

//   // Convert to async function
//   loadAndReplacePart: async (model, scene, oldPartName, newPartURL, currentAlloyRef, onReplaceCallback) => {
//     const loader = new GLTFLoader();

//     // Remove current alloy if present
//     if (currentAlloyRef.current) {
//       scene.remove(currentAlloyRef.current);
//       currentAlloyRef.current.traverse((child) => {
//         console.log(child)
//         if (child.isMesh) {
//           child.geometry?.dispose();
//           child.material?.dispose();
//         }
//       });
//       currentAlloyRef.current = null;  // Make sure the reference is cleared
//       console.log(`Removed current alloy: ${oldPartName}`);
//     }

//     // Remove old clones before adding new ones
//     PartManager.removeOldClones(scene, oldPartName);

//     const childrenData = PartManager.savedPartsData[oldPartName] || [];

//     console.log(`Loading new part for: ${oldPartName}`);

//     try {
//       // Await the loading process
//       const gltf = await new Promise((resolve, reject) => {
//         loader.load(
//           newPartURL,
//           resolve,
//           (progress) => {
//             console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`);
//           },
//           (error) => {
//             reject(error);
//           }
//         );
//       });

//       const newPart = gltf.scene.children[0];
//       const newClones = [];

//       if (childrenData.length > 0) {
//         // Use childrenData to replace parts
//         childrenData.forEach((data) => {
//           const clonedPart = newPart.clone();

//           clonedPart.position.copy(data.worldPosition);
//           clonedPart.quaternion.copy(data.worldQuaternion);
//           clonedPart.scale.copy(data.worldScale);
//           clonedPart.name = data.name; // Maintain original name

//           const parent = model.getObjectByName(oldPartName)?.parent;
//           if (parent) {
//             parent.add(clonedPart);
//           } else {
//             scene.add(clonedPart);
//             currentAlloyRef.current = clonedPart;
//           }

//           newClones.push(clonedPart); // Save the cloned part reference
//           console.log(`Replaced ${data.name}`);
//         });
//       } else {
//         // No childrenData, add the new model using currentAlloyRef
//         const clonedPart = newPart.clone();

//         clonedPart.position.set(0, 0, 0); // Default position
//         clonedPart.quaternion.set(0, 0, 0, 1); // Default rotation
//         clonedPart.scale.set(1, 1, 15); // Default scale

//         scene.add(clonedPart);
//         currentAlloyRef.current = clonedPart;

//         newClones.push(clonedPart); // Save the cloned part reference
//         console.log(`Added new part as no children data was found.`);
//       }

//       // Save new clones
//       PartManager.clonedParts[oldPartName] = newClones;

//       // Optional callback after replacement
//       if (onReplaceCallback) {
//         onReplaceCallback();
//       }
//     } catch (error) {
//       console.error(`Error loading part: ${error.message}`);
//     }
//   },
// };

// export default PartManager;


import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PartManager = {
  savedPartsData: {},
  clonedParts: {},

  // Remove a part from the model by name
  removePart: (model, partName) => {
    const part = model.getObjectByName(partName);
    const childrenData = [];
    if (part) {
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

          // Dispose geometry and material
          child.geometry?.dispose();
          if (child.material) {
            child.material.map?.dispose();
            child.material.bumpMap?.dispose();
            child.material.normalMap?.dispose();
            child.material.dispose();
          }
        }
      });

      if (part.parent) {
        part.parent.remove(part);
        console.log(`Removed part: ${partName}`);
      } else {
        console.warn(`Part ${partName} has no parent and couldn't be removed.`);
      }

      PartManager.savedPartsData[partName] = childrenData;
      return childrenData;
    } else {
      console.log(`Part ${partName} not found`);
      return null;
    }
  },

  // Remove old clones for a specific partName
  removeOldClones: (scene, partName) => {
    if (PartManager.clonedParts[partName]) {
      PartManager.clonedParts[partName].forEach((clonedPart) => {
        scene.remove(clonedPart);
        clonedPart.traverse((child) => {
          if (child.isMesh) {
            child.geometry?.dispose();
            child.material?.dispose();
          }
        });
      });
      PartManager.clonedParts[partName] = [];
      console.log(`Removed old clones for part: ${partName}`);
    } else {
      console.log(`No clones found for part: ${partName}`);
    }
  },

  // Load and replace part
  loadAndReplacePart: async (model, scene, oldPartName, newPartURL, currentAlloyRef, onReplaceCallback) => {
    const loader = new GLTFLoader();

    // Remove current alloy
    if (currentAlloyRef.current) {
      scene.remove(currentAlloyRef.current);
      currentAlloyRef.current.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
      currentAlloyRef.current = null;
      console.log(`Removed current alloy: ${oldPartName}`);
    }

    PartManager.removeOldClones(scene, oldPartName);
    const childrenData = PartManager.savedPartsData[oldPartName] || [];

    console.log(`Loading new part for: ${oldPartName}`);

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(
          newPartURL,
          resolve,
          (progress) => {
            console.log(`Loading: ${(progress.loaded / progress.total) * 100}%`);
          },
          (error) => {
            reject(error);
          }
        );
      });

      const newPart = gltf.scene.children[0];
      const newClones = [];

      if (childrenData.length > 0) {
        childrenData.forEach((data) => {
          const clonedPart = newPart.clone();

          clonedPart.position.copy(data.worldPosition);
          clonedPart.quaternion.copy(data.worldQuaternion);

          const newScale = data.worldScale.clone();
          newScale.x *= 1.5; // ✅ Increase width
          clonedPart.scale.copy(newScale);

          clonedPart.name = data.name;

          const parent = model.getObjectByName(oldPartName)?.parent;
          if (parent) {
            parent.add(clonedPart);
          } else {
            scene.add(clonedPart);
            currentAlloyRef.current = clonedPart;
          }

          newClones.push(clonedPart);
          console.log(`Replaced ${data.name}`);
        });
      } else {
        const clonedPart = newPart.clone();
        clonedPart.position.set(0, 0, 0);
        clonedPart.quaternion.set(0, 0, 0, 1);
        clonedPart.scale.set(1.5, 1, 8); // ✅ Increase width here too

        scene.add(clonedPart);
        currentAlloyRef.current = clonedPart;

        newClones.push(clonedPart);
        console.log(`Added new part as no children data was found.`);
      }

      PartManager.clonedParts[oldPartName] = newClones;

      if (onReplaceCallback) {
        onReplaceCallback();
      }
    } catch (error) {
      console.error(`Error loading part: ${error.message}`);
    }
  },
};

export default PartManager;
