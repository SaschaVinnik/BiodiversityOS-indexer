import { createPublicClient, http, parseAbiItem, type Log } from "viem";
import { celo } from "viem/chains";
import prisma from "./db.js";
import { REGISTRY_ABI } from "./abi.js";

const POLL_INTERVAL_MS = 5_000;

function parseCoord(value: bigint): number {
  return Number(value) / 1_000_000;
}

async function processLog(log: Log<bigint, number, false, typeof REGISTRY_ABI[0] | typeof REGISTRY_ABI[1]>) {
  const { args, blockNumber, transactionHash, eventName } = log as any;
  const data = {
    latitude: parseCoord(args.latitude),
    longitude: parseCoord(args.longitude),
    species: args.species as string,
    count: args.count as number,
    behavior: args.behavior as string,
    observedAt: new Date(Number(args.observedAt) * 1000),
    mediaUrl: (args.mediaUrl as string) || null,
    comment: (args.comment as string) || null,
    reporter: (args.reporter as string).toLowerCase(),
    blockNumber: blockNumber as bigint,
    txHash: transactionHash as string,
  };

  const id = Number(args.recordId as bigint);

  if (eventName === "RecordCreated") {
    await prisma.record.upsert({
      where: { id },
      create: { id, ...data },
      update: data,
    });
  } else {
    await prisma.record.update({ where: { id }, data });
  }
}

export async function startListener(contractAddress: `0x${string}`, rpcUrl: string, startBlock: bigint) {
  const chain = { ...celo, rpcUrls: { default: { http: [rpcUrl] }, public: { http: [rpcUrl] } } };
  const client = createPublicClient({ chain, transport: http(rpcUrl) });

  let state = await prisma.indexerState.upsert({
    where: { id: 1 },
    create: { id: 1, lastBlock: startBlock > 0n ? startBlock - 1n : 0n },
    update: {},
  });

  console.log(`Indexer starting from block ${state.lastBlock}`);

  async function poll() {
    try {
      const latest = await client.getBlockNumber();
      const from = state.lastBlock + 1n;
      if (from > latest) return;

      const logs = await client.getLogs({
        address: contractAddress,
        events: REGISTRY_ABI as any,
        fromBlock: from,
        toBlock: latest,
      });

      for (const log of logs) {
        await processLog(log as any);
      }

      if (logs.length > 0) {
        console.log(`Processed ${logs.length} log(s) up to block ${latest}`);
      }

      state = await prisma.indexerState.update({
        where: { id: 1 },
        data: { lastBlock: latest },
      });
    } catch (err) {
      console.error("Poll error:", err);
    }
  }

  setInterval(poll, POLL_INTERVAL_MS);
  poll();
}
