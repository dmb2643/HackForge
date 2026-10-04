package profile

import "uuid"

type ProfileResponse struct {
	ID             uuid.UUID  `json:"id"`
	Name           string     `json:"name"`
	Email          string     `json:"email"`
	Role           string     `json:"role"`
	Skills         []string   `json:"skills"`
	LookingForTeam bool       `json:"lookingForTeam"`
	TeamId         *uuid.UUID `json:"teamId"`
}

type UpdateProfileRequest struct {
	Name           string   `json:"name"`
	Role           string   `json:"role"`
	Skills         []string `json:"skills"`
	LookingForTeam bool     `json:"lookingForTeam"`
}
