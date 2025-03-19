import "./App.css";
import ColorPaletteGenerator from "./components/ColorPaletteGenerator";
import { ToastProvider } from "./components/ToasterProvider";

function App() {
  return (
    <ToastProvider>
      <div className="App">
        <ColorPaletteGenerator />
      </div>
    </ToastProvider>
  );
}

export default App;
