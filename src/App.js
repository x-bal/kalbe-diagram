import "./App.css";
import ReactFlowWrapper from "./ReactFlow";
import { writeStorage } from "@rehooks/local-storage";
import io from "socket.io-client";
import { useEffect } from "react";

const socket = io(process.env.REACT_APP_SOCKETIO_URL, {
  transports: ["websocket"],
});

let temp = {};

function App() {
  socket.on("machine-topic", ({ machine_id, sensor, value }) => {
    writeStorage(`machine_${machine_id}`, {
      ...temp[machine_id],
      [sensor]: value,
    });
    temp = {
      ...temp,
      [machine_id]: { ...temp[machine_id], [sensor]: value },
    };
  });

  socket.on("machine-status", ({ machine_id, status }) => {
    writeStorage(`machine_status_${machine_id}`, status);
  });

  useEffect(() => {
    window.localStorage.clear();
  }, []);

  return (
    <div>
      <ReactFlowWrapper />
    </div>
  );
}

export default App;
