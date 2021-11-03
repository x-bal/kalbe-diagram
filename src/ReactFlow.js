import React, { useState, useEffect, useCallback } from "react";

import ReactFlow, {
  removeElements,
  addEdge,
  updateEdge,
  Controls,
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
  height: 60px;
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
  const [bgType, setBgType] = useState("");
  const [bg, setBg] = useState(null);
  const [bgShow, setBgShow] = useState(false);
  const [styleDiagram, setStyleDiagram] = useState({});
  const [reload, setReload] = useState(0);

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
        const { elements, background } = constructData(data);
        setBgType(background.type);
        setBg(background.background);
        let style = {};
        if (background.type === "color") {
          style = {
            background: background.background,
          };
        }
        if (background.type === "image") {
          style = {
            background: `url(${background.background}) no-repeat center center fixed`,
            backgroundSize: "cover",
          };
        }
        setStyleDiagram(style);
        setElements(elements);
      } catch (error) {
        console.log("error", error);
      }
    };
    _loadData();
  }, [params.id, reload]);

  useEffect(() => {
    let mE = {};
    elements.forEach((element) => (mE[element.id] = element));
    setMappedElement(mE);
  }, [elements]);

  const _chooseBackground = (bg) => {
    setBg(bg);

    if (bgType === "color") {
      setStyleDiagram({
        background: bg,
      });

      return;
    }
    return;
  };

  const _onElementsRemove = useCallback((elementsToRemove) => {
    setSelectedElement({});
    setTypeSelected("");
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

  const _updateBackground = async () => {
    let background = {
      type: bgType,
      background: bg,
    };
    if (bgType === "image") {
      let payload = new FormData();
      payload.append("background", bg);
      const { url } = await API.lineProcess.uploadBackground(payload);
      setBg(url);
      background.background = url;
      console.log("url", url);
    }

    await _updateData(background);
  };

  const _updateData = async (background = {}) => {
    const data = await deconstructData(elements, background);
    try {
      await API.lineProcess.update(params.id, data);
      setReload(reload + 1);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {!isPublic && (
        <FormWrapper>
          <div className="row g-3 align-items-center">
            {typeSelected === "edge" && (
              <>
                <div className="col-auto">
                  <label for="inputPassword6" className="col-form-label">
                    Tipe ArrowHead
                  </label>
                </div>
                <div className="col-auto">
                  <select
                    value={mappedElement[selectedElement.id].arrowHeadType}
                    className="form-control"
                    onChange={(e) =>
                      updateElement("arrowHeadType", e.target.value)
                    }
                  >
                    <option value="none">none</option>
                    <option value="arrow">arrow</option>
                    <option value="arrowclosed">arrowclosed</option>
                  </select>
                </div>
              </>
            )}
            {typeSelected === "node" && selectedElement.type === "machine" && (
              <>
                <div className="col-auto">
                  <label for="inputPassword6" className="col-form-label">
                    Size
                  </label>
                </div>
                <div className="col-auto">
                  <div style={{ display: "none" }}>
                    {selectedElement.data.size}
                  </div>
                  <input
                    type="number"
                    className="form-control"
                    min={1}
                    max={10}
                    value={selectedElement.data.size}
                    onChange={(e) => updateElement("size", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <div className="row g-3 align-items-center">
            {bgShow && (
              <>
                <div className="col-auto">
                  <label for="inputPassword6" className="col-form-label">
                    Bg Type
                  </label>
                </div>
                <div className="col-auto">
                  <select
                    value={bgType}
                    className="form-control form-control-sm"
                    onChange={(e) => setBgType(e.target.value)}
                  >
                    <option value="">none</option>
                    <option value="image">Image</option>
                    <option value="color">Color</option>
                  </select>
                </div>
                {bgType !== "" && (
                  <>
                    <div className="col-auto">
                      {bgType === "color" && (
                        <input
                          type="color"
                          value={bg}
                          onChange={(e) => _chooseBackground(e.target.value)}
                        />
                      )}
                      {bgType === "image" && (
                        <input
                          className="form-control form-control-sm"
                          type="file"
                          accept="image/*"
                          onChange={(e) => _chooseBackground(e.target.files[0])}
                        />
                      )}
                    </div>
                  </>
                )}
                <div className="col-auto">
                  <button
                    className="btn btn-sm btn-danger"
                    type="button"
                    onClick={_updateBackground}
                  >
                    Save Bg
                  </button>
                </div>
              </>
            )}
            <div className="col-auto">
              <button
                className="btn btn-sm btn-primary"
                type="button"
                onClick={() => setBgShow(!bgShow)}
              >
                {bgShow ? ">" : "<"} Bg Setting
              </button>
            </div>
            <div className="col-auto">
              <button className="btn btn-danger" onClick={() => _updateData()}>
                Deploy
              </button>
            </div>
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
          deleteKeyCode="Delete"
          style={styleDiagram}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomNodeFlow;
