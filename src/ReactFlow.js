import React, { useState, useEffect, useCallback } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  updateEdge,
  Controls,
  Background,
  isEdge,
  isNode,
} from "react-flow-renderer";

import CustomNode from "./CustomNode";

import "./index.css";
import styled from "styled-components";
import { initialElement } from "./dummy";
import API from "./API";
import { constructData, deconstructData } from "./utils/constructor";

const edgeDefaultStyle = { strokeWidth: 2 };

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`;

const InputWrapper = styled.div`
  display: inline-block;
  label {
    margin-right: 10px;
  }
`;

const snapGrid = [20, 20];
const nodeTypes = {
  custom: CustomNode,
};

const isDiagramEditable = true;
const ID = 1;

const CustomNodeFlow = () => {
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState({});
  const [typeSelected, setTypeSelected] = useState("");
  const [isFirstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (reactflowInstance && elements.length > 0 && isFirstLoad) {
      reactflowInstance.fitView();
      setFirstLoad(false);
    }
  }, [reactflowInstance, elements.length, isFirstLoad]);

  useEffect(() => {
    const _loadData = async () => {
      try {
        const data = await API.lineProcess.get(ID);
        const elements = constructData(data);
        setElements(elements);
        console.log("elements", elements);
      } catch (error) {
        console.log("error", error);
      }
    };
    _loadData();
  }, []);

  const _onElementsRemove = useCallback((elementsToRemove) => {
    const edges = elementsToRemove.filter((element) => isEdge(element));
    setElements((els) => removeElements(edges, els));
  }, []);

  const _onConnect = useCallback(
    (params) =>
      setElements((els) =>
        addEdge({ ...params, style: edgeDefaultStyle }, els)
      ),
    []
  );

  const _onNodeDragStop = (_, element) => {
    console.log("element", element);
    setElements((els) =>
      els.map((el) => {
        if (el.id === element.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el = element;
        }

        return el;
      })
    );
  };

  const _onElementClick = (_, element) => {
    console.log("element", element);
    setSelectedElement(element);

    if (isEdge(element)) {
      setTypeSelected("edge");
    }
    if (isNode(element)) {
      setTypeSelected("node");
    }
  };

  const updateElement = (type, value) => {
    setSelectedElement((el) => ({
      ...el,
      data: {
        ...el.data,
        [type]: value,
      },
    }));
    // TODO: handle value outside data
    setElements((els) =>
      els.map((el) => {
        if (el.id === selectedElement.id) {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          el.data = {
            ...el.data,
            [type]: value,
          };
        }

        return el;
      })
    );
  };

  const _onEdgeUpdate = (oldEdge, newConnection) =>
    setElements((els) => updateEdge(oldEdge, newConnection, els));

  const _onLoad = useCallback(
    (rfi) => {
      console.log("onload");
      if (!reactflowInstance) {
        setReactflowInstance(rfi);
      }
    },
    [reactflowInstance]
  );

  const _updateData = async () => {
    const data = await deconstructData(elements);

    try {
      await API.lineProcess.update(ID, data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <FormWrapper>
        <div>
          <InputWrapper>
            <label>{typeSelected} ID</label>
            <input value={selectedElement.id} disabled />
          </InputWrapper>

          {typeSelected === "edge" && (
            <>
              <InputWrapper>
                <label>Tipe ArrowHead</label>
                <select
                  value={selectedElement.arrowHeadType}
                  onChange={(e) =>
                    updateElement("arrowHeadType", e.target.value)
                  }
                >
                  <option value="none">none</option>
                  <option value="arrow">arrow</option>
                  <option value="arrowclosed">arrowclosed</option>
                </select>
              </InputWrapper>
            </>
          )}
          {typeSelected === "node" && (
            <>
              <InputWrapper>
                <label>Size </label>
                <div style={{ display: "none" }}>
                  {selectedElement.data.size}
                </div>
                <select
                  value={selectedElement.data.size}
                  onChange={(e) => updateElement("size", e.target.value)}
                >
                  <option value="small">small</option>
                  <option value="medium">medium</option>
                  <option value="large">large</option>
                </select>
              </InputWrapper>
            </>
          )}
        </div>
        <div>
          <button onClick={_updateData}>Save</button>
        </div>
      </FormWrapper>
      <div style={{ width: "100%", height: "calc(100% - 150px)" }}>
        <ReactFlow
          elements={elements}
          onElementClick={_onElementClick}
          onElementsRemove={_onElementsRemove}
          onConnect={_onConnect}
          onLoad={_onLoad}
          nodeTypes={nodeTypes}
          snapToGrid={true}
          snapGrid={snapGrid}
          defaultZoom={1.5}
          multiSelectionKeyCode={null}
          onEdgeUpdate={_onEdgeUpdate}
          onEdgeDoubleClick={(_, el) => console.log("onEdgeDoubleClick", el)}
          nodesDraggable={isDiagramEditable}
          nodesConnectable={isDiagramEditable}
          elementsSelectable={isDiagramEditable}
          onNodeDragStop={_onNodeDragStop}
          selectNodesOnDrag={false}
        >
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomNodeFlow;
