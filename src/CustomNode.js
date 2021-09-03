import React, { memo } from "react";

import { Handle } from "react-flow-renderer";
import styled from "styled-components";

const SensorWrapper = styled.div`
  position: fixed;
  margin-top: 20px;
  font-size: small;
`;

const HandleWrapper = ({ type, position, index, isConnectable, ...props }) => (
  <Handle
    type={type}
    position={position}
    style={{
      background: type === "source" ? "red" : "green",
      top: 15 * index,
      borderRadius: "100%",
    }}
    onConnect={(params) => console.log("handle onConnect", params)}
    isConnectable={isConnectable}
    {...props}
  />
);

const ImageWrapper = styled.img`
  max-width: 100%;
`;

const SIZE_WIDTH = {
  container: {
    small: 100,
    medium: 150,
    large: 200,
  },
  title: {
    small: "0.8rem",
    medium: "1rem",
    large: "1.2rem",
  },
};

export default memo(({ data, isConnectable }) => {
  const {
    sensors = [],
    image,
    name,
    portIn = 1,
    portOut = 1,
    size = "medium",
  } = data;

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
      <div
        style={{
          width: SIZE_WIDTH.container[size || "medium"],
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: SIZE_WIDTH.title[size || "medium"],
          }}
        >
          {name}
        </div>
        <div style={{ textAlign: "center" }}>
          <ImageWrapper src={image} alt={name} />
        </div>
        <SensorWrapper>
          {sensors.map((sensor) => (
            <>
              {sensor.label} = {sensor.value} <br />
            </>
          ))}
        </SensorWrapper>
      </div>

      {Array.from(Array(portOut)).map((_, i) => {
        const index = i + 1;
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
    </>
  );
});
