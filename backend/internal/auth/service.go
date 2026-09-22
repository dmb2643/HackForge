package auth

import (
	"context"
	"fmt"
	"uuid"

	"github.com/dmb2643/HackForge/internal/user"
	"golang.org/x/crypto/bcrypt"
)

type AuthRepository interface {
	CreateUser(ctx context.Context, email, name, passwordHash string) (uuid.UUID, error)
	CheckUserExists(ctx context.Context, email string) (bool, error)
	GetUserByEmail(ctx context.Context, email string) (user.User, error)
}

type AuthService struct {
	repo AuthRepository
}

func NewAuthService(repo AuthRepository) *AuthService {
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
		return RegisterResponse{}, fmt.Errorf("check user exists: %w", err)
	}
	if exists {
		return RegisterResponse{}, ErrUserAllreadyExists
	}

	bytes, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return RegisterResponse{}, fmt.Errorf("hash password: %w", err)
	}

	u := user.User{
		Email:        req.Email,
		Name:         req.Name,
		PasswordHash: string(bytes),
	}

	id, err := s.repo.CreateUser(ctx, u.Email, u.Name, u.PasswordHash)
	if err != nil {
		return RegisterResponse{}, fmt.Errorf("create user: %w", err)
	}

	resp := RegisterResponse{
		ID:    id,
		Email: req.Email,
	}

	return resp, nil
}

func (s *AuthService) Login(ctx context.Context, req LoginRequest) (LogionResponse, error) {
	if req.Email == "" {
		return LogionResponse{}, fmt.Errorf("email is required")
	}
	if req.Password == "" {
		return LogionResponse{}, fmt.Errorf("password is required")
	}
	if len(req.Password) < 8 {
		return LogionResponse{}, fmt.Errorf("password must be at least 8 characters")
	}
	if len(req.Email) < 3 {
		return LogionResponse{}, fmt.Errorf("email must be at least 3 characters")
	}

	u, err := s.repo.GetUserByEmail(ctx, req.Email)
	if err != nil {
		return LogionResponse{}, fmt.Errorf("get user by email: %w", err)
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(req.Password)); err != nil {
		return LogionResponse{}, fmt.Errorf(ErrInvalidPassword.Error(), err)
	}

	return LogionResponse{
		ID:    u.ID,
		Name:  u.Name,
		Email: u.Email,
	}, nil
}
