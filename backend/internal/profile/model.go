package profile

type profileModel struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Email          string   `json:"email"`
	Role           string   `json:"role"`
	Skills         []string `json:"skills"`
	LookingForTeam bool     `json:"looking_for_team"`
	TeamID         string   `json:"team_id"`
}
