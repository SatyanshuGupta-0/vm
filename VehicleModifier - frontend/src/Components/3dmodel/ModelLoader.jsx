import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const ModelLoader = {
  /**
   * Loads a GLTF model into the scene, replacing any existing model.
   * 
   * @param {string} modelUrl - URL or path to the GLTF model file.
   * @param {THREE.Scene} scene - Three.js scene to add the model to.
   * @param {React.MutableRefObject} currentModelRef - Ref holding current loaded model.
   * @param {Function} setLoading - React state setter to toggle loading spinner.
   */
  loadModel: (modelUrl, scene, currentModelRef, setLoading) => {
    if (!scene) {
      console.error('Scene is not provided or is invalid.');
      return;
    }

    if (!currentModelRef || typeof currentModelRef.current === 'undefined') {
      console.error('currentModelRef is not properly initialized.');
      return;
    }

    const loader = new GLTFLoader();

    // Dispose and remove previous model from the scene
    if (currentModelRef.current) {
      try {
        scene.remove(currentModelRef.current);

        currentModelRef.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();

            // Dispose all materials, handle array of materials
            if (Array.isArray(child.material)) {
              child.material.forEach((material) => material.dispose());
            } else if (child.material) {
              child.material.dispose();
            }
          }
        });

        currentModelRef.current = null;
      } catch (err) {
        console.error('Error while disposing of the current model:', err);
      }
    }

    setLoading(true);

    // Responsive scale based on device width
    const isMobile = window.innerWidth <= 768;
    const scale = isMobile ? 1.5 : 1.7;

    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;

        // Apply uniform scale and position adjustments
        model.scale.set(scale, scale, scale);
        model.position.set(0, 0, 0);

        // Optional: rotate model if needed (in radians)
        model.rotation.set(0, 4.5, 0);

        scene.add(model);
        currentModelRef.current = model;

        console.log('Model loaded successfully with scale:', scale);
        setLoading(false);
      },
      (progress) => {
        if (progress.total) {
          const percentage = (progress.loaded / progress.total) * 100;
          console.log(`Loading model: ${percentage.toFixed(2)}% complete`);
          localStorage.setItem("loadmodel", percentage.toFixed(2));
        }
      },
      (error) => {
        console.error('Error loading model:', error);
        setLoading(false);
      }
    );
  },
};

export default ModelLoader;
