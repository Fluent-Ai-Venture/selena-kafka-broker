# Selena Kafka Broker

This module provides Kafka broker, schema registry, and topic management for the Selena AI system.

## Configuration

All configuration is managed through environment variables. The default values are set in the `.env` file:

- `ZOOKEEPER_PORT`: Port for Zookeeper (default: 2181)
- `KAFKA_INTERNAL_PORT`: Internal Kafka port (default: 9092)
- `KAFKA_EXTERNAL_PORT`: External Kafka port (default: 29092)
- `SCHEMA_REGISTRY_PORT`: Schema Registry port (default: 8081)
- `CONTROL_CENTER_PORT`: Control Center UI port (default: 9021)
- `KAFKA_HOST`: Hostname for Kafka (default: localhost)
- `ZOOKEEPER_HOST`: Hostname for Zookeeper (default: zookeeper)
- `SCHEMA_REGISTRY_HOST`: Hostname for Schema Registry (default: schema-registry)
- `KAFKA_BROKERS`: Combined string for Kafka brokers (default: localhost:29092)
- `SCHEMA_REGISTRY_URL`: URL for Schema Registry (default: http://localhost:8081)

## Setup

1. Make sure you have Docker and Docker Compose installed
2. Customize the `.env` file if needed
3. Start the Kafka services:

```bash
npm run start
```

4. Create the required topics:

```bash
npm run create-topics
```

## Available Services

- Kafka Broker: `localhost:29092`
- Schema Registry: `http://localhost:8081`
- Control Center UI: `http://localhost:9021`

## Management

- Start all services: `npm run start`
- Stop all services: `npm run stop`
- Restart all services: `npm run restart`
