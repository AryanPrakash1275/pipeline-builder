import { ReactFlowProvider } from "reactflow";
import { PipelineToolbar } from "./toolbar";
import { PipelineUI } from "./ui";
import "./styles/vs.css";

function App() {
  return (
    <ReactFlowProvider>
      <div>
        <PipelineToolbar />
        <PipelineUI />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
