import React, { memo } from "react";
import { useLocalStorage } from "@rehooks/local-storage";

export default memo(({ data }) => {
  const { machine_id, machine_name } = data;
  const [sensors] = useLocalStorage(`machine_${machine_id}`);

  return (
    <div>
      <small style={{ color: "black" }}>Sensor {machine_name}</small>
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
