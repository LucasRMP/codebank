package kafka

import (
	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

type KafkaProducer struct {
	Producer *ckafka.Producer
}

func NewKafkaProducer() KafkaProducer {
	return KafkaProducer{}
}

func (kafkaProducer *KafkaProducer) SetupProducer(bootstrapServer string) {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": bootstrapServer,
	}

	kafkaProducer.Producer, _ = ckafka.NewProducer(configMap)
}

func (kafkaProducer *KafkaProducer) Publish(msg string, topic string) error {
	message := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{
			Topic: &topic,
			Partition: ckafka.PartitionAny,
		},
		Value: []byte(msg),		
	}

	err := kafkaProducer.Producer.Produce(message, nil)

	return err
}
