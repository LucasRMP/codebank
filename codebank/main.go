package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/LucasRMP/codebank/infrastructure/grpc/server"
	"github.com/LucasRMP/codebank/infrastructure/kafka"
	"github.com/LucasRMP/codebank/infrastructure/repository"
	"github.com/LucasRMP/codebank/usecase"
	_ "github.com/lib/pq"
)

func SetupDb() *sql.DB {
	psqlConfig := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		"db",
		"5432",
		"postgres",
		"root",
		"codebank",
	)

	db, err := sql.Open("postgres", psqlConfig)

	if err != nil {
		log.Fatal("Error stablishing a connection with the database")
	}

	return db
}

func SetupTransactionUseCase(db *sql.DB, producer *kafka.KafkaProducer) *usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	useCase.KafkaProducer = *producer
	return useCase
}

func SetupKafkaProducer() kafka.KafkaProducer {
	producer := kafka.NewKafkaProducer()
	producer.SetupProducer("host.docker.internal:9094")
	return producer
}

func ServeGRPC(processTransactionUseCase *usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = *processTransactionUseCase
	fmt.Println("gRPC server listening on port 50051")
	grpcServer.Serve()
}

func main() {
	db := SetupDb()
	defer db.Close() // defer = Do something at the end of everything

	producer := SetupKafkaProducer()
	
	processTransactionUseCase := SetupTransactionUseCase(db, &producer)
	ServeGRPC(processTransactionUseCase)
}
