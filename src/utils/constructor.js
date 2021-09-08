import { isEdge, isNode } from "react-flow-renderer";

export const constructData = (data) => {
  let { edges = [], machines = [] } = data;
  edges = Array.isArray(edges) ? edges : [];

  const machinesObj = _constructMachines(machines);
  return [...machinesObj, ...edges];
};

const defaultMachineProps = {
  selectable: false,
  type: "machine",
};

const _constructMachines = (machines) => {
  let constructedMachines = [];
  let sensors = [];
  machines.forEach((machine, index) => {
    let {
      id,
      name,
      style,
      position,
      portIn,
      portOut,
      image,
      size = 3,
    } = machine;
    position = position || {};
    constructedMachines.push({
      id: String(id),
      data: {
        name,
        portIn,
        portOut,
        image,
        size: typeof size === "string" ? 3 : size,
      },
      style: style || {},
      position: position.machine || { y: 0, x: 200 * (index + 1) },
      ...defaultMachineProps,
    });
    sensors.push({
      id: `sensor_${id}`,
      position: position.machine || { y: 400, x: 200 * (index + 1) },
      type: "sensor",
      selectable: false,
      style: {
        border: "1px solid black",
        padding: "10px",
        background: "white",
      },
      data: {
        machine_id: String(id),
        machine_name: name,
      },
    });
  });
  return [...constructedMachines, ...sensors];
};

export const deconstructData = (data) => {
  console.log("deconstructData", data);
  const nodes = data.filter((item) => isNode(item));
  const edges = data.filter((item) => isEdge(item));
  const machines = _deconstructMachines(nodes);
  return { machines, edges };
};

const _deconstructMachines = (nodes) => {
  let mappedMachines = {},
    machines = [];
  nodes.forEach((node) => {
    if (node.type === "machine") {
      const { data, id, style, position } = node;
      mappedMachines[id] = {
        id: parseInt(id),
        style,
        position: { machine: position },
        ...data,
      };
    }
    if (node.type === "sensor") {
      const { data, position } = node;
      mappedMachines[data.machine_id].position.sensor = position;
    }
  });

  Object.keys(mappedMachines).forEach((key) => {
    machines.push(mappedMachines[key]);
  });

  return machines;
};
