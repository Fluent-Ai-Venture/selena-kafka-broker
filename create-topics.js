require('dotenv').config();
const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const kafkaBrokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const schemaRegistryUrl = process.env.SCHEMA_REGISTRY_URL || 'http://localhost:8081';
const kafka = new Kafka({
  clientId: 'topic-configurator',
  brokers: kafkaBrokers
});

async function registerSchema(topic, schemaPath) {
  const schemaData = fs.readFileSync(schemaPath, 'utf-8');
  const subject = `${topic}-value`; // convention for value schemas
  try {
    const response = await axios.post(
      `${schemaRegistryUrl}/subjects/${subject}/versions`,
      { schema: schemaData },
      { headers: { 'Content-Type': 'application/vnd.schemaregistry.v1+json' } }
    );
    console.log(`Registered schema for ${subject}: id ${response.data.id}`);
  } catch (err) {
    if (err.response && err.response.status === 409) {
      console.log(`Schema for ${subject} already registered.`);
    } else {
      console.error(`Failed to register schema for ${subject}:`, err.message);
    }
  }
}

async function createTopics() {
  console.log('Creating topics...' + kafkaBrokers);
  const admin = kafka.admin();
  await admin.connect();

  const configPath = path.join(__dirname, 'topics-config.json');
  const topicsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

  const topics = topicsConfig.map(cfg => ({
    topic: cfg.topic,
    numPartitions: cfg.partitions,
    replicationFactor: cfg.replicationFactor,
    configEntries: Object.entries(cfg.config).map(([key, value]) => ({ name: key, value: value }))
  }));

  await admin.createTopics({ topics, waitForLeaders: true });
  console.log('Topics created or already exist:', topics.map(t => t.topic));
  await admin.disconnect();

  // Register schemas
  for (const cfg of topicsConfig) {
    const schemaFile = path.join(__dirname, 'schemas', `${cfg.topic.replace(/s$/, '')}.avsc`);
    if (fs.existsSync(schemaFile)) {
      await registerSchema(cfg.topic, schemaFile);
    } else {
      console.warn(`No schema file found for topic ${cfg.topic} (${schemaFile})`);
    }
  }
}

createTopics().catch(err => {
  console.error('Failed to create topics:', err);
  process.exit(1);
});
