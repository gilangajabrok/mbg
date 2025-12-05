package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

func main() {
	host := flag.String("host", "localhost", "DB host")
	port := flag.String("port", "5432", "DB port")
	user := flag.String("user", "postgres", "DB user")
	password := flag.String("password", "postgres", "DB password")
	dbname := flag.String("db", "mbg", "DB name")
	flag.Parse()

	dsn := fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", *user, *password, *host, *port, *dbname)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer pool.Close()

	migrationSQL, err := os.ReadFile("migrations/002_create_user_profiles.sql")
	if err != nil {
		log.Fatalf("Failed to read migration file: %v", err)
	}

	_, err = pool.Exec(ctx, string(migrationSQL))
	if err != nil {
		log.Fatalf("Failed to execute migration: %v", err)
	}

	fmt.Println("✓ Migration executed successfully!")
	fmt.Println("✓ user_profiles table created")
}
