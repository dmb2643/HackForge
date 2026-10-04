package profile

import "fmt"

var (
	ErrNameMustBeAtLeast5Chars = fmt.Errorf("name must be at least 5 characters")
)
