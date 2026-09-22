package auth

import (
	"context"
	"uuid"

	"github.com/dmb2643/HackForge/internal/user"
	"github.com/jackc/pgx/v5"
)

type PostgresAuthRepository struct {
	db *pgx.Conn
}

func NewRepository(db *pgx.Conn) *PostgresAuthRepository {
	return &PostgresAuthRepository{
		db: db,
	}
}

func (r *PostgresAuthRepository) CreateUser(ctx context.Context, email, name, passwordHash string) (uuid.UUID, error) {
	var id uuid.UUID
	q := `
	INSERT INTO users ( email, name, password_hash) VALUES ($1, $2, $3) RETURNING id
	`

	err := r.db.QueryRow(ctx, q, email, name, passwordHash).Scan(&id)
	if err != nil {
		return uuid.UUID{}, err
	}
	return id, nil
}

func (r *PostgresAuthRepository) CheckUserExists(ctx context.Context, email string) (bool, error) {
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

func (r *PostgresAuthRepository) GetUserByEmail(ctx context.Context, email string) (user.User, error) {
	var u user.User
	q := `
		SELECT id, email, password_hash, name FROM users WHERE email = $1
	`

	if err := r.db.QueryRow(ctx, q, email).Scan(
		&u.ID,
		&u.Email,
		&u.PasswordHash,
		&u.Name,
	); err != nil {
		return user.User{}, err
	}

	return u, nil

}
