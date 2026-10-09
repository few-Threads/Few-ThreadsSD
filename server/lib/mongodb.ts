import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Scenario from '../models/Scenario';
import KnowledgeCard from '../models/KnowledgeCard';
import { NodeRegistry } from '../models/ToolRegistry';

import scenarioData from '../../src/data/content/presetScenarios.json';
import knowledgeData from '../../src/data/content/knowledgeCards.json';
import registryData from '../../src/data/registry/fewthreads_merged_registry.json';

const MONGODB_URI = process.env.MONGODB_URI;

let mongoServer: any = null;
let connectionPromise: Promise<void> | null = null;

// Reuses one connection per process (important for serverless warm starts)
export function connectToDatabase(): Promise<void> {
  if (!connectionPromise) {
    connectionPromise = connect().catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }
  return connectionPromise;
}

async function connect() {
  let connectionString = MONGODB_URI;

  if (!connectionString) {
    if (process.env.VERCEL) {
      throw new Error('MONGODB_URI is not set. Add it in Vercel → Project Settings → Environment Variables.');
    }

    console.log('⚠️ MONGODB_URI not found in environment variables. Attempting to start in-memory MongoDB database...');
    try {
      // Module name kept in a variable so serverless bundlers don't trace this dev-only dependency
      const memoryServerModule = 'mongodb-memory-server';
      const { MongoMemoryServer } = await import(memoryServerModule);
      const path = await import('path');
      const fs = await import('fs');
      
      const dbPath = path.resolve(process.cwd(), '.mongo-data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }
      
      mongoServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        },
      });
      
      connectionString = mongoServer.getUri();
      console.log(`✨ In-memory MongoDB server started successfully at ${connectionString}`);
      console.log(`💾 Persistent data stored in ${dbPath}`);
    } catch (err: any) {
      console.error('❌ Failed to spin up in-memory MongoDB:', err.message);
      throw new Error('Please configure a valid MONGODB_URI in your .env file.');
    }
  }

  await mongoose.connect(connectionString!, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected successfully');

  // Seed scenarios / knowledge cards / registry into any empty collection (fresh Atlas or in-memory DB)
  await seedDatabaseIfEmpty();
}

async function seedDatabaseIfEmpty() {
  try {
    const scenarioCount = await Scenario.countDocuments();
    const cardCount = await KnowledgeCard.countDocuments();
    const registryCount = await NodeRegistry.countDocuments();

    if (scenarioCount === 0 || cardCount === 0 || registryCount === 0) {
      console.log('🔌 Database is empty. Seeding initial data...');
      
      // Seed scenarios
      if (scenarioCount === 0) {
        console.log(`Seeding ${scenarioData.scenarios.length} scenarios...`);
        for (const scenario of scenarioData.scenarios) {
          await Scenario.findOneAndUpdate(
            { title: scenario.title },
            {
              title: scenario.title,
              description: scenario.commonInterviewQuestion,
              module: 'system_design',
              difficulty: scenario.difficulty.toLowerCase(),
              tags: [scenario.domain.toLowerCase()],
              metadata: scenario
            },
            { upsert: true, new: true }
          );
        }
      }

      // Seed knowledge cards
      if (cardCount === 0) {
        console.log(`Seeding ${knowledgeData.components.length} knowledge cards...`);
        for (const card of knowledgeData.components) {
          await KnowledgeCard.findOneAndUpdate(
            { componentId: card.componentId },
            card,
            { upsert: true, new: true }
          );
        }
      }

      // Seed registry
      if (registryCount === 0) {
        const registry = registryData.nodeToolRegistry as any;
        console.log(`Seeding ${Object.keys(registry).length} registry nodes...`);
        for (const [nodeId, nodeData] of Object.entries(registry) as [string, any][]) {
          const flatTools = nodeData.toolGroups?.flatMap((g: any) =>
            (g.tools || []).map((t: any) => ({
              ...t,
              groupId: g.groupId,
              groupName: g.groupName
            }))
          ) || [];

          await NodeRegistry.findOneAndUpdate(
            { nodeId },
            {
              nodeId,
              nodeName: nodeData.nodeName,
              category: nodeData.category,
              subcategory: nodeData.subcategory,
              description: nodeData.description,
              isClientOrigin: nodeData.isClientOrigin || false,
              validChaos: nodeData.validChaos || [],
              invalidChaos: nodeData.invalidChaos || {},
              validConnections: nodeData.validConnections || {},
              commonMistakes: nodeData.commonMistakes || [],
              realWorldUsage: nodeData.realWorldUsage || [],
              tools: flatTools,
              clientTypes: nodeData.clientTypes || []
            },
            { upsert: true, new: true }
          );
        }
      }
      console.log('✅ In-memory database auto-seeded successfully!');
    }
  } catch (err) {
    console.error('⚠️ Failed to auto-seed in-memory database:', err);
  }
}

export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
  connectionPromise = null;
}
