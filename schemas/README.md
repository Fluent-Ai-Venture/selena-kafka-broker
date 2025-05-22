# Avro Schemas for Kafka Topics

This directory contains Avro schema files used for topic validation and serialization. To associate a topic with a schema, ensure the topic name in `topics-config.json` matches the schema file name (e.g., `audio-processing-events` topic uses `audio-processing-event.avsc`).

If you add new topics, create a corresponding `.avsc` file here and update your topic configuration accordingly.
