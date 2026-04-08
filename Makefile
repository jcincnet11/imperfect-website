PROJECT_NAME = imperfect

.PHONY: help build test run lint typecheck unit deploy deploy-preview logs status db-schema db-reset db-seed db-push docs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ── Development ──────────────────────────────────────────────────────────────

run: ## Start local dev server (http://localhost:3000)
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server locally (requires build first)
	npm start

# ── Code Quality ─────────────────────────────────────────────────────────────

lint: ## Run ESLint
	npm run lint

typecheck: ## Run TypeScript type checking
	npx tsc --noEmit

unit: ## Run unit tests (vitest)
	npm run test

test: lint typecheck unit ## Run all checks (lint + typecheck + unit tests)

# ── Database ─────────────────────────────────────────────────────────────────

db-schema: ## Print current Supabase schema
	supabase db dump --schema public

db-reset: ## Reset local Supabase and apply schema
	supabase db reset

db-seed: ## Seed Supabase with local JSON dev data
	npx tsx scripts/seed-db.ts

db-push: ## Push pending migrations to remote Supabase
	npx supabase db push

# ── Deployment ───────────────────────────────────────────────────────────────

deploy: ## Deploy to Vercel production
	vercel --prod

deploy-preview: ## Deploy to Vercel preview
	vercel

logs: ## Tail production logs
	vercel logs https://imperfect-sage.vercel.app --follow

status: ## Show Vercel deployment status
	vercel ls $(PROJECT_NAME)

# ── Docs ─────────────────────────────────────────────────────────────────────

docs: ## Serve docs locally
	python3 -m http.server 8080 --directory docs
