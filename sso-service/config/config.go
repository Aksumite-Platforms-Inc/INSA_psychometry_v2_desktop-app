package config

import (
	"crypto/rsa"
	"encoding/json"
	"log"
	"os"

	"github.com/square/go-jose/v3"
	"github.com/INSA_psychometry_v2/sso-service/utils"
)

var (
	Config ServiceConfig
)

type ServiceConfig struct {
	RestfulEndpoint *string `json:"restfulapi_endpoint"`
	DbName          *string `json:"db_name"`
	DbUser          *string `json:"db_user"`
	DbPassword      *string `json:"db_password"`
	DbHost       *string `json:"db_host"`
	DbPort          *string `json:"db_port"`
	JWKS            *jose.JSONWebKeySet
	PrivateKey      *rsa.PrivateKey
	Name            *string
	Version         *string
	Environment     *string `json:"environment"`
	Development     *bool
}

func InitConfiguration(filename string) (*ServiceConfig, error) {
	Config = ServiceConfig{}

	file, err := os.Open(filename)
	if err != nil {
		panic("Configuration file not found.")
	}

	if err := json.NewDecoder(file).Decode(&Config); err != nil {
		panic("Couldn't decode config values to struct.")
	}

	Config.PrivateKey, err = utils.NewRSAKey()

	if err != nil {
		log.Fatalf("failed to generate rsa key: %v", err)
	}

	jwk := utils.NewJSONWebKey(&Config.PrivateKey.PublicKey)

	Config.JWKS = &jose.JSONWebKeySet{Keys: []jose.JSONWebKey{*jwk}}
	return &Config, nil
}
