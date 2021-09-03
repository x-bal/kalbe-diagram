export const machines = [
  {
    id: '1',
    machine: "machine1",
    image: "https://picsum.photos/id/100/200",
    sensors: [
      { label: "tn1-10b", value: 100 },
      { label: "tn2-110b", value: 180 },
      { label: "tn3-10b", value: 20 },
      { label: "tn2-10b11", value: 90 },
    ],
    portIn: 2,
    portOut: 2,
    size: "small", // small, medium, large di fe
    position: { x: 0, y: 0 },
    style: { border: "1px solid #777", padding: 10 },
  },
];

export const edges = [
  {
    id: "123asdasdaw",
    source: "2",
    target: "3",
    arrowHeadType: "arrow",
    sourceHandle: "1",
    targetHandle: "1",
    animated: true,
    style: { stroke: "#fff" },
  },
  {
    id: "123asdasdaw",
    source: "2",
    target: "3",
    arrowHeadType: "arrow",
    sourceHandle: "2",
    targetHandle: "1",
    animated: true,
    style: { stroke: "#fff" },
  },
];



get by lineProcessId
{
  machines:[],
  edges:[],
}

update by lineProcessId
{
  machines:[],
  edges:[],
}


checkToken


ws per lineProcessId

