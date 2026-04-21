export const typeDefs = /* GraphQL */ `
  enum Species {
    nurse_shark
    caribbean_reef_shark
    great_hammerhead_shark
    hammerhead_shark
    bull_shark
    tiger_shark
    whale_shark
    unknown
  }

  enum Behavior {
    feeding
    migrating
    resting
    mating
    hunting
    stranded
    unknown
  }

  type Record {
    id: Int!
    latitude: Float!
    longitude: Float!
    species: Species!
    count: Int!
    behavior: Behavior!
    observedAt: String!
    mediaUrl: String
    comment: String
    reporter: String!
    blockNumber: String!
    txHash: String!
    createdAt: String!
    updatedAt: String!
  }

  type RecordsPage {
    items: [Record!]!
    total: Int!
    hasMore: Boolean!
  }

  input RecordsFilter {
    species: Species
    behavior: Behavior
    reporter: String
    observedAtGt: String
    observedAtLt: String
  }

  type Query {
    records(limit: Int = 50, offset: Int = 0, filter: RecordsFilter): RecordsPage!
    record(id: Int!): Record
  }
`;
