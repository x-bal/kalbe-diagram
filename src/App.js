import "./App.css";
import ReactFlowWrapper from "./ReactFlow";
import { writeStorage } from "@rehooks/local-storage";
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKETIO_URL, {
  transports: ["websocket"],
});

function App() {
  socket.on("machine-topic", ({ machine_id, sensor, value }) =>
    writeStorage(`machine_${machine_id}`, { [sensor]: value })
  );

  return (
    <div>
      <ReactFlowWrapper />
    </div>
  );
}

export default App;
