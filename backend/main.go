package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/dmb2643/HackForge/internal/auth"
	"github.com/jackc/pgx/v5"
)

func main() {
	ctx := context.Background()
	db, err := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		panic("failed to connect db" + err.Error())
	}
	slog.Info("connected to db")

	repo := auth.NewRepository(db)
	authSevice := auth.NewAuthService(repo)
	authHandler := auth.NewAuthHandler(authSevice)

	http.HandleFunc("/api/auth/register", authHandler.RegisterUser)
	http.HandleFunc("/api/auth/login", authHandler.LoginUser)
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
