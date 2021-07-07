package server

import (
	"log"
	"net"

	"github.com/LucasRMP/codebank/infrastructure/grpc/pb"
	"github.com/LucasRMP/codebank/infrastructure/grpc/service"
	"github.com/LucasRMP/codebank/usecase"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

type GRPCServer struct {
	ProcessTransactionUseCase usecase.UseCaseTransaction
}

func NewGRPCServer() *GRPCServer {
	return &GRPCServer{}
}

func (server *GRPCServer) Serve() {
	// Create the listener
	listener, err := net.Listen("tcp", "0.0.0.0:50051")

	if err != nil {
		log.Fatal("could not listen tcp port")
	}

	// Instanciate the Service (Controller)
	transactionService := service.NewTransactionService()
	transactionService.ProcessTransactionUseCase = server.ProcessTransactionUseCase

	// Create the server
	grcpServer := grpc.NewServer()
	
	// Add reflection mode so the debug client can work properly
	reflection.Register(grcpServer)

	// Register the service on the server (kinda like doing a `router.use(service)`)
	pb.RegisterPaymentServiceServer(grcpServer, transactionService)
	
	// Register the listener on the server
	grcpServer.Serve(listener)
}
