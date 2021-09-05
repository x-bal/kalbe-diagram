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

import MachineNode from "./MachineNode";
import SensorNode from "./SensorNode";
import "./index.css";
import styled from "styled-components";
import API from "./API";
import { constructData, deconstructData } from "./utils/constructor";

const edgeDefaultStyle = { strokeWidth: 2 };

const FormWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
  height: 50px;
`;

const InputWrapper = styled.div`
  display: inline-block;
  label {
    margin-right: 10px;
  }
`;

const snapGrid = [20, 20];
const nodeTypes = {
  machine: MachineNode,
  sensor: SensorNode,
};

const CustomNodeFlow = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const isPublic = params.isPublic === "true";
  const [reactflowInstance, setReactflowInstance] = useState(null);
  const [elements, setElements] = useState([]);
  const [mappedElement, setMappedElement] = useState({});
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
        const data = await API.lineProcess.get(params.id);
        const elements = constructData(data);
        setElements(elements);

        let mE = {};
        elements.forEach((element) => (mE[element.id] = element));
        setMappedElement(mE);
      } catch (error) {
        console.log("error", error);
      }
    };
    _loadData();
  }, [params.id]);

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
    setSelectedElement(element);

    if (isEdge(element)) {
      setTypeSelected("edge");
    }
    if (isNode(element)) {
      setTypeSelected("node");
    }
  };

  const updateElement = (type, value) => {
    if (typeSelected === "edge") {
      const newConnection = {
        ...selectedElement,
        [type]: value === "none" ? null : value,
      };

      setElements((els) => {
        const otherEls = els.filter((e) => e.id !== selectedElement.id);
        return [...otherEls, newConnection];
      });
      return;
    }
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
      await API.lineProcess.update(params.id, data);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!isPublic && (
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
                    value={mappedElement[selectedElement.id].arrowHeadType}
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
      )}
      <div
        style={{
          width: "100%",
          height: isPublic ? "100%" : "calc(100% - 100px)",
        }}
      >
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
          nodesDraggable={!isPublic}
          nodesConnectable={!isPublic}
          elementsSelectable={!isPublic}
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
