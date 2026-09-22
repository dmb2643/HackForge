package user

import "uuid"

type User struct {
	ID           uuid.UUID
	Email        string
	PasswordHash string
	Name         string
}
