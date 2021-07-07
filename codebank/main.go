package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/LucasRMP/codebank/infrastructure/grpc/server"
	"github.com/LucasRMP/codebank/infrastructure/kafka"
	"github.com/LucasRMP/codebank/infrastructure/repository"
	"github.com/LucasRMP/codebank/usecase"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
)

func SetupDb() *sql.DB {
	psqlConfig := fmt.Sprintf(
		"host=%s port=%s user=%s password=%s dbname=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
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
	producer.SetupProducer(os.Getenv("KAFKA_BOOTSTRAP_SERVERS"))
	return producer
}

func ServeGRPC(processTransactionUseCase *usecase.UseCaseTransaction) {
	grpcServer := server.NewGRPCServer()
	grpcServer.ProcessTransactionUseCase = *processTransactionUseCase
	fmt.Println("gRPC server listening on port 50051")
	grpcServer.Serve()
}

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("failed loading the enviroment")
	}
}

func main() {
	db := SetupDb()
	defer db.Close() // defer = Do something at the end of everything

	producer := SetupKafkaProducer()
	
	processTransactionUseCase := SetupTransactionUseCase(db, &producer)
	ServeGRPC(processTransactionUseCase)
}
