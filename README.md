# DocumentGPT — AI-Powered Document Chat Application

A complete DocumentGPT application with AWS infrastructure deployment. Upload PDFs and chat with your documents using AI, with real-time WebSocket communication and scalable cloud architecture.

## 🚀 Features

- **PDF Upload & Processing**: Drag-and-drop interface for document uploads
- **AI Chat Interface**: Real-time chat with your documents using GPT-5
- **WebSocket Support**: Live streaming responses
- **AWS Infrastructure**: Fully deployed with Terraform (S3, Lambda, API Gateway, DynamoDB, Cognito)
- **Vector Search**: Qdrant integration for document retrieval
- **Scalable Architecture**: Microservices with Lambda functions
- **Authentication**: AWS Cognito integration
- **CI/CD Ready**: GitHub Actions workflow for automated deployment

## 🏗️ Architecture

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: AWS Lambda functions (Node.js and Python)
- **Database**: DynamoDB for metadata, Qdrant for vector storage
- **API**: API Gateway with WebSocket support
- **Infrastructure**: Terraform-managed AWS resources
- **Authentication**: AWS Cognito User Pool

## 🎯 Current Status

✅ **Fully Deployed and Operational**
- AWS infrastructure deployed with Terraform
- WebSocket endpoint: `wss://w0ymagjkol.execute-api.us-east-1.amazonaws.com/prod`
- S3 buckets: `documentgpt-raw-1757813720` and `documentgpt-processed-1757813720`
- DynamoDB table: `docgpt`
- Lambda functions: `docgpt-chat` and `docgpt-ingest`
- Local development server running on `http://localhost:3000`

## 🚀 Quick Start

```bash
# 0) Prerequisites
brew install pnpm docker || true

# 1) Start local services
docker compose up -d

# 2) Install dependencies & run the web app
pnpm -w i
pnpm -w dev:web
```

Then visit **http://localhost:3000** to start chatting with your documents!

## Env

Copy `.env.example` to `.env` at the repo root and set values.

- `PROVIDER=openai|bedrock|mock`
- `PROVIDER_API_KEY=...` (or `OPENAI_API_KEY`, etc. as you prefer)
- `QDRANT_URL=http://localhost:6333`
- `QDRANT_API_KEY=` (empty for local)
- `NEXT_PUBLIC_APP_NAME=DocumentGPT`
- `GOOGLE_CLIENT_ID=...`
- `GOOGLE_CLIENT_SECRET=...`

> This is a scaffold: services are wired minimally so you can flesh them out fast.


---

## Deploy to **your** AWS account

1. **Create remote state (optional but recommended).**
   - Create an S3 bucket for TF state and a DynamoDB lock table, or keep local for now.

2. **Bootstrap variables.**
   ```bash
   cp infra/variables.auto.tfvars.example infra/variables.auto.tfvars
   # edit bucket names (must be globally unique)
   ```

3. **Package Lambdas.**
   ```bash
   pnpm -w i
   bash scripts/package.sh
   ```

4. **Apply infra.**
   ```bash
   terraform -chdir=infra init
   terraform -chdir=infra apply -auto-approve
   ```

5. **Wire the web app.**
   - Put `NEXT_PUBLIC_WS_URL` to the output `ws_url` (e.g., wss://.../prod).

### GitHub OIDC (CI to your account)
- Edit `infra/iam.tf` and set `YOUR_GH_OWNER/YOUR_REPO` in the `StringLike` condition.
- In GitHub repo settings, add secret `AWS_OIDC_ROLE_ARN` with the role ARN output by Terraform (or copy from console).

> Everything runs inside **your** AWS account. Data never leaves unless you configure external providers (GPT‑5, Gmail/Drive).
