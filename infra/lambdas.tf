variable "chat_zip" { default = "dist/chat-lambda.zip" }
variable "ingest_zip" { default = "dist/ingest.zip" }

resource "aws_lambda_function" "chat" {
  function_name = "docgpt-chat"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  filename      = var.chat_zip
  environment { variables = {
    PROVIDER = "mock"
  } }
}

resource "aws_lambda_function" "ingest" {
  function_name = "docgpt-ingest"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "handler.handler"
  runtime       = "python3.11"
  filename      = var.ingest_zip
}

# WS Integrations -> Lambdas
resource "aws_apigatewayv2_integration" "ws_connect" {
  api_id                 = aws_apigatewayv2_api.ws.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.chat.invoke_arn
}

resource "aws_apigatewayv2_integration" "ws_default" {
  api_id                 = aws_apigatewayv2_api.ws.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.chat.invoke_arn
}

resource "aws_apigatewayv2_integration" "ws_disconnect" {
  api_id                 = aws_apigatewayv2_api.ws.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.chat.invoke_arn
}

# Permissions for API Gateway to call the Lambda
resource "aws_lambda_permission" "ws_connect" {
  statement_id  = "AllowWSConnectInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chat.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ws.execution_arn}/*"
}

resource "aws_lambda_permission" "ws_default" {
  statement_id  = "AllowWSDefaultInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chat.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ws.execution_arn}/*"
}

resource "aws_lambda_permission" "ws_disconnect" {
  statement_id  = "AllowWSDisconnectInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.chat.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.ws.execution_arn}/*"
}

# Stage for WS
resource "aws_apigatewayv2_stage" "ws_prod" {
  api_id      = aws_apigatewayv2_api.ws.id
  name        = "prod"
  auto_deploy = true
}

output "ws_url" { value = aws_apigatewayv2_stage.ws_prod.invoke_url }
output "http_api_id" { value = aws_apigatewayv2_api.http.id }
