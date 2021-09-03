import { isEdge, isNode } from "react-flow-renderer";

export const constructData = (data) => {
  let { edges = [], machines = [] } = data;
  edges = Array.isArray(edges) ? edges : [];

  const machinesObj = _constructMachines(machines);
  return [...machinesObj, ...edges];
};

const defaultMachineStyle = {
  background: "white",
};

const defaultMachineProps = {
  selectable: false,
  type: "custom",
};

const _constructMachines = (machines) =>
  machines.map((machine, index) => {
    const {
      id,
      name,
      style,
      position,
      portIn,
      portOut,
      image,
      size = "medium",
    } = machine;
    return {
      id: String(id),
      data: {
        name,
        portIn,
        portOut,
        image,
        size,
      },
      style: style || defaultMachineStyle,
      position: position || { y: 0, x: 200 * (index + 1) },
      ...defaultMachineProps,
    };
  });

export const deconstructData = (data) => {
  const machinesFiltered = data.filter((item) => isNode(item));
  const edges = data.filter((item) => isEdge(item));
  const machines = _deconstructMachines(machinesFiltered);
  return { machines, edges };
};

const _deconstructMachines = (machines) =>
  machines.map((machine) => {
    const { data, id, style, position } = machine;
    return { id: parseInt(id), style, position, ...data };
  });
