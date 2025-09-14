resource "aws_sqs_queue" "ingest" {
  name = "docgpt-ingest"
}
