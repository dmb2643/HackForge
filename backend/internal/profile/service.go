package profile

import (
	"context"
	"fmt"
)

type profileService struct {
	repo profileRepository
}

func NewProfileService(repo profileRepository) *profileService {
	return &profileService{
		repo: repo,
	}
}

func (s *profileService) GetProfile(ctx context.Context, userId string) (profileModel, error) {
	profile, err := s.repo.GetProfileByID(ctx, userId)
	if err != nil {
		return profileModel{}, fmt.Errorf("get profile: %w", err)
	}

	return profile, nil
}

func (s *profileService) UpdateProfile(ctx context.Context, userId string, req UpdateProfileRequest) (profileModel, error) {
	if len(req.Name) < 5 {
		return profileModel{}, ErrNameMustBeAtLeast5Chars
	}

	updatedProfile, err := s.repo.UpdateProfile(ctx, userId, req)
	if err != nil {
		return profileModel{}, fmt.Errorf("update profile: %w", err)
	}

	return updatedProfile, nil
}

func (s *profileService) GetParticipants(ctx context.Context) ([]profileModel, error) {
	participants, err := s.repo.GetParticipants(ctx)
	if err != nil {
		return nil, fmt.Errorf("get participants: %w", err)
	}

	return participants, nil
}
