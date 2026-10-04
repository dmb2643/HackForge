package main

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/dmb2643/HackForge/internal/auth"
	"github.com/dmb2643/HackForge/internal/middleware"
	"github.com/dmb2643/HackForge/internal/profile"
	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	ctx := context.Background()
	db, err := pgxpool.New(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		panic("failed to connect db" + err.Error())
	}
	slog.Info("connected to db")

	repo := auth.NewRepository(db)
	authSevice := auth.NewAuthService(repo)
	authHandler := auth.NewAuthHandler(authSevice)

	profileRepo := profile.NewProfileRepository(db)
	profileService := profile.NewProfileService(*profileRepo)
	profileHandler := profile.NewProfileHandler(*profileService)

	http.HandleFunc("POST /api/auth/register", authHandler.RegisterUser)
	http.HandleFunc("POST /api/auth/login", authHandler.LoginUser)
	http.HandleFunc("GET /api/participants", profileHandler.GetParticipants)

	http.Handle("GET /api/profile/me", middleware.AuthMiddleware(http.HandlerFunc(profileHandler.GetProfile)))
	http.Handle("PUT /api/profile/me", middleware.AuthMiddleware(http.HandlerFunc(profileHandler.UpdateProfile)))

	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
