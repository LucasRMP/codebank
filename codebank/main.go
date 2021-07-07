package main

import (
	"database/sql"
	"fmt"
	"log"

	"github.com/LucasRMP/codebank/domain"
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

func SetupTransactionUseCase(db *sql.DB) *usecase.UseCaseTransaction {
	transactionRepository := repository.NewTransactionRepositoryDb(db)
	useCase := usecase.NewUseCaseTransaction(transactionRepository)
	return useCase
}

func main() {
	db := SetupDb()

	defer db.Close()
	
	cc := domain.NewCreditCard()
	cc.Number = "1234"
	cc.Name = "Lucas"
	cc.ExpirationMonth = 6
	cc.ExpirationYear = 2021
	cc.CVV = 123
	cc.Limit = 10000
	cc.Balance = 0

	transactionRepo := repository.NewTransactionRepositoryDb(db)
	err := transactionRepo.CreateCreditCard(*cc)

	if err != nil {
		fmt.Println(err)
	}
}
