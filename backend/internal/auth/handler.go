package auth

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

type AuthHandler struct {
	service *AuthService
}

func NewAuthHandler(service *AuthService) *AuthHandler {
	return &AuthHandler{
		service: service,
	}
}

func (h *AuthHandler) RegisterUser(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	req := RegisterRequest{}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		slog.Error("failed to decode request", "error", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	slog.Info(
		"registing user",
		"name:", req.Name,
		"email:", req.Email,
	)

	resp, err := h.service.Register(ctx, req)
	if err != nil {
		if err == ErrUserAllreadyExists {
			http.Error(w, err.Error(), http.StatusConflict)
			return
		}

		slog.Error("failed to register user", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode(resp); err != nil {
		slog.Error("failed to encode response", "error", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

}
