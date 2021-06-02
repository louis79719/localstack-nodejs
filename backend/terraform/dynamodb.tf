resource "aws_dynamodb_table" "pages" {
  name         = "pages"
  hash_key     = "id"
  billing_mode = "PAY_PER_REQUEST"

  attribute {
    name = "id"
    type = "S"
  }
  attribute {
    name = "platform"
    type = "S"
  }
  attribute {
    name = "locale"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_AND_OLD_IMAGES"

  global_secondary_index {
    name            = "platformLocale-index"
    hash_key        = "platform"
    range_key       = "locale"
    projection_type = "ALL"
  }

  tags = local.tags
}