package service

import (
	"context"

	"github.com/LucasRMP/codebank/domain"
	"github.com/LucasRMP/codebank/dto"
	"github.com/LucasRMP/codebank/infrastructure/grpc/pb"
	"github.com/LucasRMP/codebank/usecase"
	"github.com/golang/protobuf/ptypes/empty"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type TransactionService struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
	pb.UnimplementedPaymentServiceServer
}

func NewTransactionService() *TransactionService {
	return &TransactionService{}
}

func (transactionService *TransactionService) Payment(ctx context.Context, in *pb.PaymentRequest) (*empty.Empty, error) {
	transactionDto := dto.Transaction{
		Name: in.GetCreditCard().GetName(),
		Number: in.GetCreditCard().GetNumber(),
		ExpirationMonth: in.GetCreditCard().GetExpirationMonth(),
		ExpirationYear: in.GetCreditCard().GetExpirationYear(),
		CVV: in.GetCreditCard().GetCvv(),
		Amount: in.GetAmount(),
		Store: in.GetStore(),
		Description: in.GetDescription(),
	}

	transaction, err := transactionService.ProcessTransactionUseCase.ProcessTransaction(transactionDto)

	if err != nil {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, err.Error())
	}

	if (transaction.Status != domain.TRANSACTION_STATUS_APPROVED) {
		return &empty.Empty{}, status.Error(codes.FailedPrecondition, "transaction rejected by the bank")
	}

	return &empty.Empty{}, nil
}
