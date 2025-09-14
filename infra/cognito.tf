resource "aws_cognito_user_pool" "main" { name = "docgpt-users" }

resource "aws_cognito_user_pool_client" "web" {
  name                       = "web"
  user_pool_id               = aws_cognito_user_pool.main.id
  generate_secret            = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows       = ["code"]
  allowed_oauth_scopes      = ["email","openid","profile"]
  callback_urls             = [var.app_url]
  logout_urls               = [var.app_url]
}
