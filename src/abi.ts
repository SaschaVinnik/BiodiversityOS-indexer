export const REGISTRY_ABI = [
  {
    type: "event",
    name: "RecordCreated",
    inputs: [
      { name: "recordId", type: "uint256", indexed: true },
      { name: "reporter", type: "address", indexed: true },
      { name: "latitude", type: "int256", indexed: false },
      { name: "longitude", type: "int256", indexed: false },
      { name: "species", type: "string", indexed: false },
      { name: "count", type: "uint16", indexed: false },
      { name: "behavior", type: "string", indexed: false },
      { name: "observedAt", type: "uint256", indexed: false },
      { name: "mediaUrl", type: "string", indexed: false },
      { name: "comment", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "RecordUpdated",
    inputs: [
      { name: "recordId", type: "uint256", indexed: true },
      { name: "reporter", type: "address", indexed: true },
      { name: "latitude", type: "int256", indexed: false },
      { name: "longitude", type: "int256", indexed: false },
      { name: "species", type: "string", indexed: false },
      { name: "count", type: "uint16", indexed: false },
      { name: "behavior", type: "string", indexed: false },
      { name: "observedAt", type: "uint256", indexed: false },
      { name: "mediaUrl", type: "string", indexed: false },
      { name: "comment", type: "string", indexed: false },
    ],
  },
] as const;
