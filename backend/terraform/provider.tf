# local

terraform {
  backend "local" {}
}

provider "aws" {
  access_key                  = ""
  region                      = "us-east-1"
  s3_force_path_style         = true
  secret_key                  = ""
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true

  endpoints {
    dynamodb  = "http://0.0.0.0:4566"
    s3        = "http://0.0.0.0:4566"
    lambda    = "http://0.0.0.0:4566"
    iam       = "http://0.0.0.0:4566"
  }
}