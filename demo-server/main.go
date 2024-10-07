package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

var db *sql.DB
var jwtKey = []byte("your_secret_key")

type Credentials struct {
    Identifier string `json:"identifier"` // Can be username or email
    Password   string `json:"password"`
}

type Claims struct {
    Username string `json:"username"`
    Role     string `json:"role"`
    jwt.StandardClaims
}

func main() {
    var err error
    connStr := "user=zemu dbname=demoinsa sslmode=disable password=Qwerty@12345"
    db, err = sql.Open("postgres", connStr)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    createTable()

    router := mux.NewRouter()

    router.HandleFunc("/login", Login).Methods("POST")
    router.HandleFunc("/profile", Profile).Methods("GET")

    corsHandler := handlers.CORS(
        handlers.AllowedOrigins([]string{"*"}),
        handlers.AllowedMethods([]string{"GET", "POST", "OPTIONS"}),
        handlers.AllowedHeaders([]string{"Content-Type", "Authorization"}),
    )

    log.Fatal(http.ListenAndServe(":3001", corsHandler(router)))
}

func createTable() {
    createUserTableSQL := `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT
    );`

    _, err := db.Exec(createUserTableSQL)
    if err != nil {
        log.Fatal(err)
    }

    // Insert demo users
    insertUser("oadmin", "admin@example.com", "password", "organization_admin")
    insertUser("badmin", "branch@example.com", "password", "branch_admin")
    insertUser("user", "user@example.com", "password", "user")
}

func insertUser(username, email, password, role string) {
    hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    _, err := db.Exec("INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4)", username, email, hashedPassword, role)
    if err != nil {
        log.Println(err)
    }
}

func Login(w http.ResponseWriter, r *http.Request) {
    var creds Credentials
    err := json.NewDecoder(r.Body).Decode(&creds)
    if err != nil {
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    var storedCreds Credentials
    var role string
    err = db.QueryRow("SELECT username, password, role FROM users WHERE username=$1 OR email=$1", creds.Identifier).Scan(&storedCreds.Identifier, &storedCreds.Password, &role)
    if err != nil {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    if err = bcrypt.CompareHashAndPassword([]byte(storedCreds.Password), []byte(creds.Password)); err != nil {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    expirationTime := time.Now().Add(5 * time.Minute)
    claims := &Claims{
        Username: storedCreds.Identifier,
        Role:     role,
        StandardClaims: jwt.StandardClaims{
            ExpiresAt: expirationTime.Unix(),
        },
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    tokenString, err := token.SignedString(jwtKey)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        return
    }

    http.SetCookie(w, &http.Cookie{
        Name:    "token",
        Value:   tokenString,
        Expires: expirationTime,
    })

    json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
}

func Profile(w http.ResponseWriter, r *http.Request) {
    c, err := r.Cookie("token")
    if err != nil {
        if err == http.ErrNoCookie {
            w.WriteHeader(http.StatusUnauthorized)
            return
        }
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    tokenStr := c.Value
    claims := &Claims{}

    tkn, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
        return jwtKey, nil
    })

    if err != nil {
        if err == jwt.ErrSignatureInvalid {
            w.WriteHeader(http.StatusUnauthorized)
            return
        }
        w.WriteHeader(http.StatusBadRequest)
        return
    }

    if !tkn.Valid {
        w.WriteHeader(http.StatusUnauthorized)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{"message": fmt.Sprintf("Hello, %s!", claims.Username), "role": claims.Role})
}
