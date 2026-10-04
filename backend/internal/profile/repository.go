package profile

import (
	"context"
	"fmt"

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

func (r *profileRepository) GetParticipants(ctx context.Context, filter ParticipantsFilter) ([]profileModel, error) {
	query := `
    SELECT
        id,
        name,
        role,
        skills,
        looking_for_team
    FROM users
	`

	conditions := []string{}
	args := []any{}

	if filter.Role != "" {
		args = append(args, filter.Role)

		conditions = append(
			conditions,
			fmt.Sprintf("role = $%d", len(args)),
		)
	}

	if filter.Looking != nil {
		args = append(args, *filter.Looking)

		conditions = append(
			conditions,
			fmt.Sprintf("looking_for_team = $%d", len(args)),
		)
	}

	if filter.Skill != "" {
		args = append(args, filter.Skill)

		conditions = append(
			conditions,
			fmt.Sprintf("skills @> ARRAY[$%d]", len(args)),
		)
	}

	if len(conditions) > 0 {
		query += " WHERE " + conditions[0]
		for _, cond := range conditions[1:] {
			query += " AND " + cond
		}
	}

	var profiles []profileModel
	rows, err := r.db.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query participants %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var profile profileModel

		if err := rows.Scan(
			&profile.ID,
			&profile.Name,
			&profile.Role,
			&profile.Skills,
			&profile.LookingForTeam,
		); err != nil {
			return nil, fmt.Errorf("scan participants: %w", err)
		}

		profiles = append(profiles, profile)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("iterate participants: %w", err)
	}

	return profiles, nil
}
