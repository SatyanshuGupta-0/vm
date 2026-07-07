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