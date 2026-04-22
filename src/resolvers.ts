import prisma from "./db.js";
import type { Prisma } from "@prisma/client";

interface RecordsFilter {
  species?: string;
  behavior?: string;
  reporter?: string;
  observedAtGt?: string;
  observedAtGte?: string;
  observedAtLt?: string;
  observedAtLte?: string;
}

function buildWhere(filter?: RecordsFilter): Prisma.RecordWhereInput {
  if (!filter) return {};
  const where: Prisma.RecordWhereInput = {};
  if (filter.species) where.species = filter.species;
  if (filter.behavior) where.behavior = filter.behavior;
  if (filter.reporter) where.reporter = filter.reporter.toLowerCase();
  if (filter.observedAtGt || filter.observedAtGte || filter.observedAtLt || filter.observedAtLte) {
    where.observedAt = {};
    if (filter.observedAtGt)  where.observedAt.gt  = new Date(filter.observedAtGt);
    if (filter.observedAtGte) where.observedAt.gte = new Date(filter.observedAtGte);
    if (filter.observedAtLt)  where.observedAt.lt  = new Date(filter.observedAtLt);
    if (filter.observedAtLte) where.observedAt.lte = new Date(filter.observedAtLte);
  }
  return where;
}

function serializeRecord(r: Prisma.RecordGetPayload<object>) {
  return {
    ...r,
    blockNumber: r.blockNumber.toString(),
    observedAt: r.observedAt.toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

export const resolvers = {
  Query: {
    records: async (_: unknown, { limit = 50, offset = 0, filter }: { limit?: number; offset?: number; filter?: RecordsFilter }) => {
      const where = buildWhere(filter);
      const [items, total] = await Promise.all([
        prisma.record.findMany({ where, take: limit, skip: offset, orderBy: { id: "desc" } }),
        prisma.record.count({ where }),
      ]);
      return {
        items: items.map(serializeRecord),
        total,
        hasMore: offset + items.length < total,
      };
    },

    record: async (_: unknown, { id }: { id: number }) => {
      const r = await prisma.record.findUnique({ where: { id } });
      return r ? serializeRecord(r) : null;
    },
  },
};
