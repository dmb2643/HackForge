package auth

import "errors"

var (
	ErrUserAllreadyExists = errors.New("user with this email allready exists")
)
