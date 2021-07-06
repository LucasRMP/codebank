package usecase

import (
	"fmt"
	"runtime/debug"
	"time"

	"github.com/LucasRMP/codebank/domain"
	"github.com/LucasRMP/codebank/dto"
)

type UseCaseTransaction struct {
	TransactionRepository domain.TransactionRepository
}

func NewUseCaseTransaction(transactionRepository domain.TransactionRepository) *UseCaseTransaction {
	return &UseCaseTransaction{TransactionRepository: transactionRepository}
}

func (useCase *UseCaseTransaction) BuildCreditCard(transactionDto dto.Transaction) (*domain.CreditCard, error) {
	creditCard := domain.NewCreditCard()
	creditCard.Name = transactionDto.Name
	creditCard.Number = transactionDto.Number
	creditCard.ExpirationMonth = transactionDto.ExpirationMonth
	creditCard.ExpirationYear = transactionDto.ExpirationYear
	creditCard.CVV = transactionDto.CVV

	ccInfo, err := useCase.TransactionRepository.GetCreditCard(*creditCard)

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return nil, err
	}

	creditCard.ID = ccInfo.ID
	creditCard.Limit = ccInfo.Limit
	creditCard.Balance = ccInfo.Balance

	return creditCard, nil
}

func (useCase *UseCaseTransaction) BuildTransaction(transactionDto dto.Transaction, creditCard domain.CreditCard) *domain.Transaction {
	transaction := domain.NewTransaction()
	transaction.CreditCardId = creditCard.ID
	transaction.Amount = transactionDto.Amount
	transaction.Store = transactionDto.Store
	transaction.Description = transactionDto.Description
	transaction.CreateAt = time.Now()
	
	return transaction
}


func (useCase *UseCaseTransaction) ProcessTransaction(transactionDto dto.Transaction) (*domain.Transaction, error) {
	creditCard, err := useCase.BuildCreditCard(transactionDto)
	
	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return nil, err
	}

	transaction := useCase.BuildTransaction(transactionDto, *creditCard)
	transaction.ProcessAndValidate(creditCard)

	err = useCase.TransactionRepository.SaveTransaction(*transaction, *creditCard)
	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return nil, err
	}
	
	return transaction, nil
}