package auth

import (
	"context"
	"fmt"
	"log/slog"

	"github.com/dmb2643/HackForge/internal/user"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	repo *UserRepository
}

func NewAuthService(repo *UserRepository) *AuthService {
	return &AuthService{repo: repo}
}

func (s *AuthService) Register(ctx context.Context, req RegisterRequest) (RegisterResponse, error) {

	if req.Email == "" {
		return RegisterResponse{}, fmt.Errorf("email is required")
	}
	if req.Password == "" {
		return RegisterResponse{}, fmt.Errorf("password is required")
	}
	if req.Name == "" {
		return RegisterResponse{}, fmt.Errorf("name is required")
	}

	if len(req.Password) < 8 {
		return RegisterResponse{}, fmt.Errorf("password must be at least 8 characters")
	}

	if len(req.Name) < 3 {
		return RegisterResponse{}, fmt.Errorf("name must be at least 3 characters")
	}

	if len(req.Email) < 3 {
		return RegisterResponse{}, fmt.Errorf("email must be at least 3 characters")
	}

	exists, err := s.repo.CheckUserExists(ctx, req.Email)
	if err != nil {
		slog.Error("failed to check user exists", "error", err)
		return RegisterResponse{}, err
	}
	if exists {
		return RegisterResponse{}, ErrUserAllreadyExists
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		slog.Error("failed to hash password", "error", err)
		return RegisterResponse{}, fmt.Errorf("error to hash password %w", err)
	}

	u := user.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(bytes),
	}

	id, err := s.repo.CreateUser(ctx, u.Email, u.Name, u.PasswordHash)
	if err != nil {
		slog.Error("failed to create user", "error", err)
		return RegisterResponse{}, err
	}

	resp := RegisterResponse{
		ID:    id,
		Email: req.Email,
	}

	return resp, nil
}
