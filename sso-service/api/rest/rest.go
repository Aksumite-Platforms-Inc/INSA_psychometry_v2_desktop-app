package rest

import (
	"fmt"
	"net/http"
)

// @title INSA_psychometry_v2 Personality Test SSO Service
// @version 1
// @description This is the SSO service for Unity SaaS
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email email@email.com

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host http://0.0.0.0:8080
// @BasePath /
// @schemes http

func ServeAPI(endpoint string) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello, this is a test endpoint!")
	})

	fmt.Printf("Starting server at %s\n", endpoint)
	return http.ListenAndServe(endpoint, nil)
}
