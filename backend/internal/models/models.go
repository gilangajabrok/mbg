package models

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

// User represents a user in the system
type User struct {
	ID          string         `gorm:"primaryKey" json:"id"`
	FirstName   string         `json:"first_name"`
	LastName    string         `json:"last_name"`
	Email       string         `gorm:"uniqueIndex" json:"email"`
	Phone       string         `json:"phone"`
	Password    string         `json:"-"`    // Never expose password
	Role        string         `json:"role"` // admin, parent, supplier
	Address     string         `json:"address"`
	SchoolID    *string        `json:"school_id,omitempty"`
	IsActive    bool           `json:"is_active"`
	LastLoginAt *time.Time     `json:"last_login_at,omitempty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

// BeforeCreate generates UUID before creating a user
func (u *User) BeforeCreate(tx *gorm.DB) error {
	if u.ID == "" {
		u.ID = uuid.New().String()
	}
	return nil
}

// School represents a school
type School struct {
	ID            string         `gorm:"primaryKey" json:"id"`
	Name          string         `json:"name"`
	Address       string         `json:"address"`
	Phone         string         `json:"phone"`
	Email         string         `json:"email"`
	Principal     string         `json:"principal"`
	StudentsCount int            `json:"students_count"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (s *School) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

// Meal represents a meal
type Meal struct {
	ID          string         `gorm:"primaryKey" json:"id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Calories    int            `json:"calories"`
	Protein     float64        `json:"protein"`
	Carbs       float64        `json:"carbs"`
	Fat         float64        `json:"fat"`
	Allergens   string         `json:"allergens"`
	SchoolID    string         `json:"school_id"`
	School      *School        `json:"school,omitempty" gorm:"foreignKey:SchoolID"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (m *Meal) BeforeCreate(tx *gorm.DB) error {
	if m.ID == "" {
		m.ID = uuid.New().String()
	}
	return nil
}

// MealPlan represents a meal plan assigned to a student
type MealPlan struct {
	ID        string         `gorm:"primaryKey" json:"id"`
	StudentID string         `json:"student_id"`
	MealID    string         `json:"meal_id"`
	StartDate time.Time      `json:"start_date"`
	EndDate   time.Time      `json:"end_date"`
	Meal      *Meal          `json:"meal,omitempty" gorm:"foreignKey:MealID"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (mp *MealPlan) BeforeCreate(tx *gorm.DB) error {
	if mp.ID == "" {
		mp.ID = uuid.New().String()
	}
	return nil
}

// Supplier represents a supplier
type Supplier struct {
	ID            string         `gorm:"primaryKey" json:"id"`
	Name          string         `json:"name"`
	Email         string         `gorm:"uniqueIndex" json:"email"`
	Phone         string         `json:"phone"`
	Address       string         `json:"address"`
	ContactPerson string         `json:"contact_person"`
	UserID        string         `json:"user_id"`
	User          *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
	Rating        float64        `json:"rating"`
	IsActive      bool           `json:"is_active"`
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (s *Supplier) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

// Order represents an order from a supplier
type Order struct {
	ID           string         `gorm:"primaryKey" json:"id"`
	SupplierID   string         `json:"supplier_id"`
	Supplier     *Supplier      `json:"supplier,omitempty" gorm:"foreignKey:SupplierID"`
	SchoolID     string         `json:"school_id"`
	School       *School        `json:"school,omitempty" gorm:"foreignKey:SchoolID"`
	Status       string         `json:"status"` // pending, confirmed, delivered, cancelled
	TotalAmount  float64        `json:"total_amount"`
	OrderDate    time.Time      `json:"order_date"`
	DeliveryDate *time.Time     `json:"delivery_date,omitempty"`
	Notes        string         `json:"notes"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) error {
	if o.ID == "" {
		o.ID = uuid.New().String()
	}
	return nil
}

// Student represents a student
type Student struct {
	ID           string         `gorm:"primaryKey" json:"id"`
	FirstName    string         `json:"first_name"`
	LastName     string         `json:"last_name"`
	SchoolID     string         `json:"school_id"`
	School       *School        `json:"school,omitempty" gorm:"foreignKey:SchoolID"`
	ParentID     string         `json:"parent_id"`
	Parent       *User          `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	DateOfBirth  time.Time      `json:"date_of_birth"`
	Grade        string         `json:"grade"`
	Allergies    string         `json:"allergies"`
	DietaryNeeds string         `json:"dietary_needs"`
	CreatedAt    time.Time      `json:"created_at"`
	UpdatedAt    time.Time      `json:"updated_at"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (s *Student) BeforeCreate(tx *gorm.DB) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	return nil
}

// Announcement represents an announcement
type Announcement struct {
	ID        string         `gorm:"primaryKey" json:"id"`
	Title     string         `json:"title"`
	Content   string         `json:"content"`
	SchoolID  string         `json:"school_id"`
	School    *School        `json:"school,omitempty" gorm:"foreignKey:SchoolID"`
	CreatedBy string         `json:"created_by"`
	Creator   *User          `json:"creator,omitempty" gorm:"foreignKey:CreatedBy"`
	IsActive  bool           `json:"is_active"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (a *Announcement) BeforeCreate(tx *gorm.DB) error {
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	return nil
}

// Request/Response types for API endpoints

// SchoolCreateRequest is used for creating a new school
type SchoolCreateRequest struct {
	Name      string `json:"name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	Principal string `json:"principal"`
}

// SchoolUpdateRequest is used for updating an existing school
type SchoolUpdateRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	Address   string `json:"address"`
	Principal string `json:"principal"`
}

// MealPlanCreateRequest is used for creating a new meal plan
type MealPlanCreateRequest struct {
	StudentID string    `json:"student_id" binding:"required"`
	MealID    string    `json:"meal_id" binding:"required"`
	StartDate time.Time `json:"start_date" binding:"required"`
	EndDate   time.Time `json:"end_date" binding:"required"`
}

// MealPlanUpdateRequest is used for updating a meal plan
type MealPlanUpdateRequest struct {
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

// OrderCreateRequest is used for creating a new order
type OrderCreateRequest struct {
	SupplierID   string     `json:"supplier_id" binding:"required"`
	SchoolID     string     `json:"school_id" binding:"required"`
	TotalAmount  float64    `json:"total_amount" binding:"required"`
	DeliveryDate *time.Time `json:"delivery_date"`
	Notes        string     `json:"notes"`
}

// OrderUpdateRequest is used for updating an order
type OrderUpdateRequest struct {
	TotalAmount  *float64   `json:"total_amount"`
	DeliveryDate *time.Time `json:"delivery_date"`
	Notes        *string    `json:"notes"`
}

// SupplierCreateRequest is used for creating a new supplier
type SupplierCreateRequest struct {
	Name          string `json:"name" binding:"required"`
	Email         string `json:"email" binding:"required,email"`
	Phone         string `json:"phone"`
	Address       string `json:"address"`
	ContactPerson string `json:"contact_person"`
	UserID        string `json:"user_id" binding:"required"`
}

// SupplierUpdateRequest is used for updating a supplier
type SupplierUpdateRequest struct {
	Name          *string  `json:"name"`
	Email         *string  `json:"email"`
	Phone         *string  `json:"phone"`
	Address       *string  `json:"address"`
	ContactPerson *string  `json:"contact_person"`
	Rating        *float64 `json:"rating"`
	IsActive      *bool    `json:"is_active"`
}

// StudentCreateRequest is used for creating a new student
type StudentCreateRequest struct {
	FirstName    string    `json:"first_name" binding:"required"`
	LastName     string    `json:"last_name" binding:"required"`
	SchoolID     string    `json:"school_id" binding:"required"`
	ParentID     string    `json:"parent_id" binding:"required"`
	DateOfBirth  time.Time `json:"date_of_birth" binding:"required"`
	Grade        string    `json:"grade" binding:"required"`
	Allergies    string    `json:"allergies"`
	DietaryNeeds string    `json:"dietary_needs"`
}

// StudentUpdateRequest is used for updating a student
type StudentUpdateRequest struct {
	FirstName    *string `json:"first_name"`
	LastName     *string `json:"last_name"`
	Grade        *string `json:"grade"`
	Allergies    *string `json:"allergies"`
	DietaryNeeds *string `json:"dietary_needs"`
}

// MealCreateRequest is used for creating a new meal
type MealCreateRequest struct {
	Name        string  `json:"name" binding:"required"`
	Description string  `json:"description"`
	Calories    int     `json:"calories" binding:"required"`
	Protein     float64 `json:"protein"`
	Carbs       float64 `json:"carbs"`
	Fat         float64 `json:"fat"`
	Allergens   string  `json:"allergens"`
	SchoolID    string  `json:"school_id" binding:"required"`
}

// MealUpdateRequest is used for updating a meal
type MealUpdateRequest struct {
	Name        *string  `json:"name"`
	Description *string  `json:"description"`
	Calories    *int     `json:"calories"`
	Protein     *float64 `json:"protein"`
	Carbs       *float64 `json:"carbs"`
	Fat         *float64 `json:"fat"`
	Allergens   *string  `json:"allergens"`
}

// AnnouncementCreateRequest is used for creating a new announcement
type AnnouncementCreateRequest struct {
	Title     string `json:"title" binding:"required"`
	Content   string `json:"content" binding:"required"`
	SchoolID  string `json:"school_id" binding:"required"`
	CreatedBy string `json:"created_by" binding:"required"`
	IsActive  bool   `json:"is_active"`
}

// AnnouncementUpdateRequest is used for updating an announcement
type AnnouncementUpdateRequest struct {
	Title    *string `json:"title"`
	Content  *string `json:"content"`
	IsActive *bool   `json:"is_active"`
}

// Error types
var (
	ErrNotFound   = errors.New("not found")
	ErrValidation = errors.New("validation error")
	ErrDuplicate  = errors.New("duplicate record")
	ErrInternal   = errors.New("internal server error")
)

// SchoolRepository interface defines school data access methods
type SchoolRepository interface {
	Create(ctx context.Context, school *School) error
	GetByID(ctx context.Context, id string) (*School, error)
	GetByEmail(ctx context.Context, email string) (*School, error)
	List(ctx context.Context, limit, offset int) ([]School, error)
	Update(ctx context.Context, id string, req *SchoolUpdateRequest) (*School, error)
	Delete(ctx context.Context, id string) error
}

// MealPlanRepository interface defines meal plan data access methods
type MealPlanRepository interface {
	Create(ctx context.Context, mealPlan *MealPlan) error
	GetByID(ctx context.Context, id string) (*MealPlan, error)
	GetByStudent(ctx context.Context, studentID string, limit, offset int) ([]MealPlan, error)
	GetByMeal(ctx context.Context, mealID string, limit, offset int) ([]MealPlan, error)
	List(ctx context.Context, limit, offset int) ([]MealPlan, error)
	Update(ctx context.Context, id string, req *MealPlanUpdateRequest) (*MealPlan, error)
	Delete(ctx context.Context, id string) error
}

// OrderRepository interface defines order data access methods
type OrderRepository interface {
	Create(ctx context.Context, order *Order) error
	GetByID(ctx context.Context, id string) (*Order, error)
	GetBySupplier(ctx context.Context, supplierID string, limit, offset int) ([]Order, error)
	GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]Order, error)
	GetByStatus(ctx context.Context, status string, limit, offset int) ([]Order, error)
	List(ctx context.Context, limit, offset int) ([]Order, error)
	UpdateStatus(ctx context.Context, id, status string) (*Order, error)
	Update(ctx context.Context, id string, req *OrderUpdateRequest) (*Order, error)
	Delete(ctx context.Context, id string) error
}

// SupplierRepository interface defines supplier data access methods
type SupplierRepository interface {
	Create(ctx context.Context, supplier *Supplier) error
	GetByID(ctx context.Context, id string) (*Supplier, error)
	GetByEmail(ctx context.Context, email string) (*Supplier, error)
	List(ctx context.Context, limit, offset int) ([]Supplier, error)
	Update(ctx context.Context, id string, req *SupplierUpdateRequest) (*Supplier, error)
	Delete(ctx context.Context, id string) error
}

// StudentRepository interface defines student data access methods
type StudentRepository interface {
	Create(ctx context.Context, student *Student) error
	GetByID(ctx context.Context, id string) (*Student, error)
	GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]Student, error)
	GetByParent(ctx context.Context, parentID string, limit, offset int) ([]Student, error)
	List(ctx context.Context, limit, offset int) ([]Student, error)
	Update(ctx context.Context, id string, req *StudentUpdateRequest) (*Student, error)
	Delete(ctx context.Context, id string) error
}

// MealRepository interface defines meal data access methods
type MealRepository interface {
	Create(ctx context.Context, meal *Meal) error
	GetByID(ctx context.Context, id string) (*Meal, error)
	GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]Meal, error)
	List(ctx context.Context, limit, offset int) ([]Meal, error)
	Update(ctx context.Context, id string, req *MealUpdateRequest) (*Meal, error)
	Delete(ctx context.Context, id string) error
}

// AnnouncementRepository interface defines announcement data access methods
type AnnouncementRepository interface {
	Create(ctx context.Context, announcement *Announcement) error
	GetByID(ctx context.Context, id string) (*Announcement, error)
	GetBySchool(ctx context.Context, schoolID string, limit, offset int) ([]Announcement, error)
	List(ctx context.Context, limit, offset int) ([]Announcement, error)
	Update(ctx context.Context, id string, req *AnnouncementUpdateRequest) (*Announcement, error)
	Delete(ctx context.Context, id string) error
}
