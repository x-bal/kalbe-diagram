import "./App.css";
import ReactFlowWrapper from "./ReactFlow";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_SOCKETIO_URL);

socket.on("alarm", (value) => {
  console.log("value", value);
});
function App() {
  socket.on("log-topic", (value) => {
    console.log("value log-topic", value);
  });
  return (
    <div>
      <ReactFlowWrapper />
    </div>
  );
}

export default App;
