import React, { useState, useEffect, useCallback } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  Controls,
  Background,
} from "react-flow-renderer";

import CustomNode from "./CustomNode";

import "./index.css";

const onNodeDragStop = (event, node) => console.log("drag stop", node);
const onElementClick = (event, element) => console.log("click", element);

// const connectionLineStyle = { stroke: "#fff" };
const snapGrid = [20, 20];
const nodeTypes = {
  selectorNode: CustomNode,
};

const CustomNodeFlow = () => {
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [elements, setElements] = useState([]);

  useEffect(() => {
    setElements([
      {
        id: "2",
        type: "selectorNode",
        data: {
          machine: "machine1",
          image: "https://picsum.photos/id/100/200",
          sensors: [
            { label: "tn1-10b", value: 100 },
            { label: "tn2-110b", value: 180 },
            { label: "tn3-10b", value: 20 },
            { label: "tn2-10b11", value: 90 },
          ],
          portIn: 2,
          portOut: 2,
          type: "small", // small, medium, large
        },
        style: { border: "1px solid #777", padding: 10, background: "white" },
        position: { x: 300, y: 50 },
      },
      {
        id: "3",
        type: "selectorNode",
        data: {
          machine: "machine1",
          image: "https://picsum.photos/id/100/200",
          sensors: [
            { label: "tn1-10b", value: 100 },
            { label: "tn2-110b", value: 180 },
            { label: "tn3-10b", value: 20 },
            { label: "tn2-10b11", value: 90 },
          ],
          portIn: 3,
          portOut: 2,
        },
        style: { border: "1px solid #777", padding: 10, background: "white" },
        position: { x: 650, y: 25 },
      },
      {
        id: "123asdasdaw",
        source: "2",
        target: "3",
        arrowHeadType: "arrow",
        sourceHandle: "2",
        targetHandle: "1",
        // animated: true,
        // style: { stroke: "#fff" },
      },
      {
        id: "33",
        source: "2",
        target: "3",
        sourceHandle: "1",
        targetHandle: "2",
      },
      // {
      //   id: "e2b-4",
      //   source: "2",
      //   target: "3",
      //   sourceHandle: "2",
      //   targetHandle: "1",
      //   // animated: true,
      //   // style: { stroke: "#fff" },
      // },
    ]);
  }, []);

  useEffect(() => {
    if (reactflowInstance && elements.length > 0) {
      reactflowInstance.fitView();
    }
  }, [reactflowInstance, elements.length]);

  const onElementsRemove = useCallback(
    (elementsToRemove) =>
      setElements((els) => removeElements(elementsToRemove, els)),
    []
  );
  const onConnect = useCallback(
    (params) =>
      setElements((els) => addEdge({ ...params, animated: true }, els)),
    []
  );

  const onLoad = useCallback(
    (rfi) => {
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
        console.log("flow loaded:", rfi);
      }
    },
    [reactflowInstance]
  );

  return (
    <ReactFlow
      elements={elements}
      onElementClick={onElementClick}
      onElementsRemove={onElementsRemove}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onLoad={onLoad}
      nodeTypes={nodeTypes}
      snapToGrid={true}
      snapGrid={snapGrid}
      defaultZoom={1.5}
    >
      <Controls />
      <Background />
    </ReactFlow>
  );
};

export default CustomNodeFlow;
