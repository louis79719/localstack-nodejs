locals {
  service_name = "louis-microservice"
  tags = {
    Name               = local.service_name
    Application        = local.service_name
    Environment        = var.env
    ManagedBy          = "Terraform"
    Owner              = "louis79719@gmail.com"
    CentralisedLogging = "Enabled"
  }
}