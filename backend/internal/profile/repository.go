package profile

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type profileRepository struct {
	db *pgxpool.Pool
}

func NewProfileRepository(db *pgxpool.Pool) *profileRepository {
	return &profileRepository{
		db: db,
	}
}

func (r *profileRepository) GetProfileByID(ctx context.Context, userID string) (profileModel, error) {
	q := `
		SELECT
			id,
			name,
			skills,
			looking_for_team
		FROM users
		WHERE id = $1
	`

	var profile profileModel

	if err := r.db.QueryRow(ctx, q, userID).Scan(
		&profile.ID,
		&profile.Name,
		&profile.Skills,
		&profile.LookingForTeam,
	); err != nil {
		return profileModel{}, err
	}

	return profile, nil
}

func (r *profileRepository) UpdateProfile(ctx context.Context, userId string, req UpdateProfileRequest) (profileModel, error) {
	q := `
		UPDATE users
		SET name = $2, role = $3, skills = $4, looking_for_team = $5
		WHERE id = $1
		RETURNING id, name, role, skills, looking_for_team
	`

	var updatedProfile profileModel

	if err := r.db.QueryRow(ctx, q, userId, req.Name, req.Role, req.Skills, req.LookingForTeam).Scan(
		&updatedProfile.ID,
		&updatedProfile.Name,
		&updatedProfile.Role,
		&updatedProfile.Skills,
		&updatedProfile.LookingForTeam,
	); err != nil {
		return updatedProfile, err
	}

	return updatedProfile, nil
}

func (r *profileRepository) GetParticipants(ctx context.Context) ([]profileModel, error) {
	q := `
		select
			id,
			name,
			role,
			skills,
			looking_for_team
		from users
	`

	rows, err := r.db.Query(ctx, q)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var participants []profileModel
	for rows.Next() {
		var p profileModel
		if err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Role,
			&p.Skills,
			&p.LookingForTeam,
		); err != nil {
			return nil, err
		}
		participants = append(participants, p)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return participants, nil
}
