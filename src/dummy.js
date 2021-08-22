export const initialElement = [
  {
    id: "1",
    type: "custom",
    data: {
      name: "machine1",
      image: "https://picsum.photos/id/110/200",
      size: "small", // small, medium, large
    },
    style: { border: "1px solid #777", padding: 10, background: "white" },
    position: { x: 10, y: 50 },
    selectable: false,
  },
  {
    id: "2",
    type: "custom",
    data: {
      name: "machine1",
      image: "https://picsum.photos/id/101/200",
      portIn: 2,
      portOut: 2,
      size: "medium", // small, medium, large
    },
    style: { border: "1px solid #777", padding: 10, background: "white" },
    position: { x: 300, y: 50 },
    selectable: false,
  },
  {
    id: "3",
    type: "custom",
    data: {
      name: "machine1",
      image: "https://picsum.photos/id/10/200",
      size: "large",
      portIn: 3,
      portOut: 2,
    },
    style: { border: "1px solid #777", padding: 10, background: "white" },
    position: { x: 650, y: 50 },
    selectable: false,
  },
  {
    id: "213",
    source: "2",
    target: "3",
    arrowHeadType: "arrowclosed",
    sourceHandle: "2",
    targetHandle: "1",
    style: { strokeWidth: 2 },
  },
  {
    id: "33",
    source: "2",
    target: "3",
    sourceHandle: "1",
    targetHandle: "2",
    style: { strokeWidth: 2 },
  },
];
