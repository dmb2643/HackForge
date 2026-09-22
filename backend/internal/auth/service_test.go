package auth

import (
	"context"
	"testing"
	"uuid"

	"github.com/dmb2643/HackForge/internal/user"
)

type fakeAuthRepository struct{}

func (r *fakeAuthRepository) CreateUser(ctx context.Context, email, name, passwordHash string) (uuid.UUID, error) {
	return uuid.New(), nil
}

func (r *fakeAuthRepository) CheckUserExists(ctx context.Context, email string) (bool, error) {
	return true, nil
}

func (r *fakeAuthRepository) GetUserByEmail(ctx context.Context, email string) (user.User, error) {
	return user.User{}, nil
}

func TestEmpty(t *testing.T) {
	repo := &fakeAuthRepository{}
	service := NewAuthService(repo)

	if _, err := service.Register(context.Background(), RegisterRequest{
		Email:    "",
		Name:     "",
		Password: "",
	}); err == nil {
		t.Errorf("expected error, have %s", err.Error())
	}
}
