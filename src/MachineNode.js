import React, { memo, useEffect, useState, useCallback } from "react";
import { Handle } from "react-flow-renderer";
import styled from "styled-components";
import { useLocalStorage } from "@rehooks/local-storage";

const STATUS_MACHINE = {
  STOP: "STOP",
  RUN: "RUN",
  OFFLINE: "OFFLINE",
};

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

// default offline

export default memo(({ id, data, isConnectable }) => {
  const {
    imageRun,
    imageOffline,
    imageStop,
    name,
    portIn = 1,
    portOut = 1,
    size = 3,
    status: initialStatus,
  } = data;
  const [image, setImage] = useState(imageOffline);
  const [status] = useLocalStorage(`machine_status_${id}`);

  const fontSize = size > 7 ? "large" : size > 4 ? "medium" : "small";

  const refreshImage = useCallback(
    (stat) => {
      if (stat === STATUS_MACHINE.STOP) {
        setImage(imageStop);
        return;
      }
      if (stat === STATUS_MACHINE.RUN) {
        setImage(imageRun);
        return;
      }
      if (stat === STATUS_MACHINE.OFFLINE) {
        setImage(imageOffline);
        return;
      }
    },
    [imageStop, imageRun, imageOffline]
  );

  useEffect(() => {
    refreshImage(status);
  }, [status, refreshImage]);

  useEffect(() => {
    refreshImage(initialStatus);
  }, [initialStatus, refreshImage]);

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
        {imageOffline && (
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
