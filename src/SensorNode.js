import React, { memo } from "react";
import { useLocalStorage } from "@rehooks/local-storage";

export default memo(({ data }) => {
  const { machine_id } = data;
  const [sensors] = useLocalStorage(`machine_${machine_id}`);

  return (
    <div style={{ minWidth: 100, minHeight: 50 }}>
      {Object.keys(sensors || {}).map((key) => {
        return (
          <div key={key}>
            <small>
              {key}: {sensors[key]}
            </small>
          </div>
        );
      })}
    </div>
  );
});
