package auth

import (
	"context"

	"github.com/jackc/pgx/v5"
)

type UserRepository struct {
	db *pgx.Conn
}

func NewRepository(db *pgx.Conn) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) CreateUser(ctx context.Context, email, name, passwordHash string) (int, error) {
	var id int
	q := `
	INSERT INTO users ( email, name, password_hash) VALUES ($1, $2, $3) RETURNING id
	`

	err := r.db.QueryRow(ctx, q, email, name, passwordHash).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

func (r *UserRepository) CheckUserExists(ctx context.Context, email string) (bool, error) {
	var exists bool
	q := `
		SELECT EXISTS (SELECT 1 FROM USERS WHERE email = $1)
	`

	err := r.db.QueryRow(ctx, q, email).Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}
