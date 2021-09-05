import React, { memo } from "react";
import { Handle } from "react-flow-renderer";
import styled from "styled-components";

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

const FONT_SIZE = {
  small: "0.7rem",
  medium: "1rem",
  large: "1.2rem",
};

const BASE_SIZE = 50;

export default memo(({ data, isConnectable }) => {
  const { image, name, portIn = 1, portOut = 1, size = 3 } = data;
  const fontSize = size > 7 ? "large" : size > 4 ? "medium" : "small";

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
          width: BASE_SIZE * size,
          minHeight: BASE_SIZE * size,
          position: "relative",
        }}
      >
        <div
          style={{
            fontSize: FONT_SIZE[fontSize || "medium"],
          }}
        >
          {name}
        </div>
        {image && (
          <div style={{ textAlign: "center" }}>
            <ImageWrapper src={image} alt={name} />
          </div>
        )}
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
