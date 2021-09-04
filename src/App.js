import "./App.css";
import ReactFlowWrapper from "./ReactFlow";
import { io } from "socket.io-client";

const socket = io("ws://139.59.118.136:3000", {
  transports: ["websocket"],
});
// const socket = io(process.env.REACT_APP_SOCKETIO_URL, {
//   transports: ["websocket"],
// });

function App() {
  socket.on("log-topic", (value) => {
    console.log("value", value);
  });
  socket.on("machine-topic", (value) => {
    console.log("value log-topic", value);
  });
  return (
    <div>
      <ReactFlowWrapper />
    </div>
  );
}

export default App;
