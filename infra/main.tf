terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = ">= 5.0" }
  }
}
provider "aws" { region = var.region }

resource "aws_s3_bucket" "raw" { bucket = var.raw_bucket }
resource "aws_s3_bucket" "processed" { bucket = var.processed_bucket }

resource "aws_dynamodb_table" "main" {
  name         = var.ddb_table
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"
  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
}

output "raw_bucket" { value = aws_s3_bucket.raw.id }
output "processed_bucket" { value = aws_s3_bucket.processed.id }
