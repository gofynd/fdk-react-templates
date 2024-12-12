# Viewer3D Component

The `Viewer3D` component provides a 3D model viewer using the `<model-viewer>` Web Component. It supports features such as auto-rotation, camera controls, and lazy loading of the 3D viewer script.

## Features
- **3D Model Rendering**: Displays a 3D model using the `<model-viewer>` component.
- **Lazy Loading**: Dynamically loads the model viewer library to optimize performance.
- **Camera Controls**: Allows users to interact with the model by rotating and zooming.
- **Auto-Rotation**: Automatically rotates the model if enabled.

## Usage
To use the `Viewer3D` component, you need to import it into your React application and provide the required props.

### Example

```jsx
import React from "react";
import Viewer3D from "fdk-react-templates/page-layouts/plp/Components/viewer-3d/viewer-3d";
import "fdk-react-templates/page-layouts/plp/Components/viewer-3d/viewer-3d.css";

const App = () => {
  return (
    <div>
      <h1>3D Model Viewer</h1>
      <Viewer3D 
        src="https://example.com/model.glb" 
        prompt="A 3D model of a product" 
        autoRotate={true} 
      />
    </div>
  );
};

export default App;

```
### Props
- **src** (string): The URL of the 3D model to be rendered. This is a required prop.
- **prompt** (string): A description or prompt for accessibility purposes (e.g., for screen readers).
- **autoRotate** (boolean): Enables or disables the auto-rotation of the 3D model.
- **children** (ReactNode): Additional elements or components to render alongside the 3D model viewer.

```
This README provides a detailed overview of the `Viewer3d` component, including usage and configuration details. Ensure to update any placeholders with actual information specific to your project.
