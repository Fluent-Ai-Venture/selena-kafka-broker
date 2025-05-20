// Node script to create Kafka topics as described in topics-config.json
const { Kafka } = require('kafkajs');
const fs = require('fs');
const path = require('path');

const kafkaBrokers = (process.env.KAFKA_BROKERS || 'localhost:9092').split(',');
const kafka = new Kafka({
  clientId: 'topic-configurator',
  brokers: kafkaBrokers
});

async function createTopics() {
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
}

createTopics().catch(err => {
  console.error('Failed to create topics:', err);
  process.exit(1);
});
