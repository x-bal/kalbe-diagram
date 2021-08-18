import React, { memo } from "react";

import { Handle } from "react-flow-renderer";

const HandleWrapper = ({ type, position, index, isConnectable, ...props }) => (
  <Handle
    type={type}
    position={position}
    style={{ background: "#555", top: 15 * index, borderRadius: 0 }}
    onConnect={(params) => console.log("handle onConnect", params)}
    isConnectable={isConnectable}
    {...props}
  />
);

export default memo(({ data, isConnectable }) => {
  const { sensors, image, machine, portIn = 0, portOut = 0 } = data;
  console.log("portIn: ", portIn);
  return (
    <>
      {Array.from(Array(portIn)).map((_, i) => {
        const index = i + 1;
        return (
          <HandleWrapper
            type="target"
            position="left"
            id={String(index)}
            index={index}
            key={index}
            isConnectable={isConnectable}
          />
        );
      })}
      <div style={{ width: 250 }}>
        <div>{machine}</div>
        <div style={{ textAlign: "center" }}>
          <img src={image} alt={machine} />
        </div>
        <div style={{ borderTop: "1px solid gray", fontSize: "small" }}>
          {sensors.map((sensor) => (
            <span>
              {sensor.label} = {sensor.value} |{" "}
            </span>
          ))}
        </div>
      </div>

      {Array.from(Array(portOut)).map((_, i) => {
        const index = i + 1;
        console.log(
          "🚀 ~ file: CustomNode.js ~ line 50 ~ {Array.from ~ index",
          index
        );
        return (
          <HandleWrapper
            type="source"
            position="right"
            id={String(index)}
            index={index}
            key={index}
            isConnectable={isConnectable}
          />
        );
      })}

      {/* <Handle
        type="source"
        position="right"
        id="a"
        style={{ top: 10, background: "#555" }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position="right"
        id="b"
        style={{
          bottom: 10,
          top: "auto",
          background: "#555",
          borderRadius: "0%",
        }}
        isConnectable={isConnectable}
      /> */}
    </>
  );
});
