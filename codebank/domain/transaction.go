package domain

import (
	"time"

	uuid "github.com/satori/go.uuid"
)

type TransactionStatus int32
const (
	TRANSACTION_STATUS_APPROVED TransactionStatus = iota
	TRANSACTION_STATUS_REJECTED TransactionStatus = iota
)

type Transaction struct {
	ID 							string
	Amount 					float64
	Status 					TransactionStatus
	Description 		string
	Store 					string
	CreditCardId 		string
	CreateAt 				time.Time
}

type TransactionRepository interface {
	SaveTransaction(transaction Transaction, creditCard CreditCard) error

	// DDD: this method is in this repo because the idea is to have one repository to the aggregated entities
	GetCreditCard(creditCard CreditCard) (CreditCard, error)
	CreateCreditCard(creditCard CreditCard) error
	UpdateBalance(creditCard CreditCard) error
}

func NewTransaction() *Transaction {
	transaction := &Transaction{}
	transaction.ID = uuid.NewV4().String()
	transaction.CreateAt = time.Now()

	return transaction
}

func (transaction *Transaction) ProcessAndValidate(creditCard *CreditCard) {
	if transaction.Amount + creditCard.Balance > creditCard.Limit {
		transaction.Status = TRANSACTION_STATUS_REJECTED
	} else {
		transaction.Status = TRANSACTION_STATUS_APPROVED
		creditCard.Balance = creditCard.Balance + transaction.Amount
	}
}
