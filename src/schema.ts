export const typeDefs = /* GraphQL */ `
  type Record {
    id: Int!
    latitude: Float!
    longitude: Float!
    species: String!
    count: Int!
    behavior: String!
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
    species: String
    behavior: String
    reporter: String
    observedAtGt: String
    observedAtLt: String
  }

  type Query {
    records(limit: Int = 50, offset: Int = 0, filter: RecordsFilter): RecordsPage!
    record(id: Int!): Record
  }
`;
