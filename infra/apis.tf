# HTTP API (REST-ish) for uploads/ingest queueing (backed by Lambda later)
resource "aws_apigatewayv2_api" "http" {
  name          = "docgpt-http"
  protocol_type = "HTTP"
}

# WebSocket API for chat streaming (Lambda posts to connections)
resource "aws_apigatewayv2_api" "ws" {
  name                        = "docgpt-ws"
  protocol_type               = "WEBSOCKET"
  route_selection_expression  = "$request.body.action"
}

# WS Routes
resource "aws_apigatewayv2_route" "ws_connect" {
  api_id    = aws_apigatewayv2_api.ws.id
  route_key = "$connect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_connect.id}"
}

resource "aws_apigatewayv2_route" "ws_default" {
  api_id    = aws_apigatewayv2_api.ws.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.ws_default.id}"
}

resource "aws_apigatewayv2_route" "ws_disconnect" {
  api_id    = aws_apigatewayv2_api.ws.id
  route_key = "$disconnect"
  target    = "integrations/${aws_apigatewayv2_integration.ws_disconnect.id}"
}
