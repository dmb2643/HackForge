package profile

import (
	"encoding/json"
	"log/slog"
	"net/http"

	"github.com/dmb2643/HackForge/internal/middleware"
)

type profileHandler struct {
	service profileService
}

func NewProfileHandler(service profileService) *profileHandler {
	return &profileHandler{
		service: service,
	}
}

func (h *profileHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userId := r.Context().Value(middleware.UserIdKey).(string)

	profile, err := h.service.GetProfile(r.Context(), userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		slog.Error("failed to get profile", "error:", err.Error())
		return
	}

	json.NewEncoder(w).Encode(profile)
}

func (h *profileHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	UserId := r.Context().Value(middleware.UserIdKey).(string)

	req := UpdateProfileRequest{}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	updatedProfile, err := h.service.UpdateProfile(r.Context(), UserId, req)
	if err != nil {
		if err == ErrNameMustBeAtLeast5Chars {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		http.Error(w, err.Error(), http.StatusInternalServerError)
		slog.Error("failed to update profile", "error:", err.Error())
		return
	}

	json.NewEncoder(w).Encode(updatedProfile)
}

func (h *profileHandler) GetParticipants(w http.ResponseWriter, r *http.Request) {
	participants, err := h.service.GetParticipants(r.Context())
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		slog.Error("failed to get participants", "error:", err.Error())
		return
	}

	json.NewEncoder(w).Encode(participants)
}
