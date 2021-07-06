package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"runtime/debug"

	"github.com/LucasRMP/codebank/domain"
)

type TransactionRepositoryDb struct {
	db *sql.DB
}

func NewTransactionRepositoryDb(db *sql.DB) *TransactionRepositoryDb {
	return &TransactionRepositoryDb{db: db}
}

func (repository *TransactionRepositoryDb) SaveTransaction(transaction domain.Transaction, creditCard domain.CreditCard) error {
	statement, err := repository.db.Prepare(`
		INSERT INTO transactions(id, credit_card_id, amount, status, description, store, created_at)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
	`)

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return err
	}

	_, err = statement.Exec(
		transaction.ID,
		creditCard.ID,
		transaction.Amount,
		transaction.Status,
		transaction.Description,
		transaction.Store,
		transaction.CreateAt,
	)

	if err != nil {
		return err
	}
	
	if transaction.Status == domain.TRANSACTION_STATUS_APPROVED {
		// creditCard.Balance = creditCard.Balance - transaction.Amount
		err = repository.UpdateBalance(creditCard)

		if err != nil {
			fmt.Println(err)
			debug.PrintStack()
			return err
		}
	}

	err = statement.Close()

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return err
	}

	return nil
}

func (repository *TransactionRepositoryDb) UpdateBalance(creditCard domain.CreditCard) error {
	_, err := repository.db.Exec("UPDATE credit_cards SET balance = $1 WHERE id = $2", creditCard.Balance, creditCard.ID)

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return err
	}

	return nil
}

func (repository *TransactionRepositoryDb) CreateCreditCard(creditCard domain.CreditCard) error {
	statement, err := repository.db.Prepare(`
		INSERT INTO credit_cards(id, name, number, expiration_month, expiration_year, cvv, balance, balance_limit)
			VALUES($1, $2, $3, $4, $5, $6, $7, $8)
	`)

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return err
	}

	_, err = statement.Exec(
		creditCard.ID,
		creditCard.Name,
		creditCard.Number,
		creditCard.ExpirationMonth,
		creditCard.ExpirationYear,
		creditCard.CVV,
		creditCard.Balance,
		creditCard.Limit,
	)

	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return err
	}

	err = statement.Close()
	return err
}

func (repository *TransactionRepositoryDb) GetCreditCard(creditCard domain.CreditCard) (domain.CreditCard, error) {
	var c domain.CreditCard
	stmt, err := repository.db.Prepare("SELECT id, balance, balance_limit FROM credit_cards WHERE number=$1")
	if err != nil {
		fmt.Println(err)
		debug.PrintStack()
		return c, err
	}
	if err = stmt.QueryRow(creditCard.Number).Scan(&c.ID, &c.Balance, &c.Limit); err != nil {
		return c, errors.New("credit card does not exists")
	}
	
	return c, nil
}