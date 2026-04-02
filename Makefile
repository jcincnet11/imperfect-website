PROJECT_NAME = imperfect

.PHONY: help build test run lint typecheck deploy logs status db-schema db-reset db-seed docs

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

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

test: lint typecheck ## Run all checks (lint + typecheck)

# ── Database ─────────────────────────────────────────────────────────────────

db-schema: ## Print current Supabase schema (requires supabase CLI + login)
	supabase db dump --schema public

db-reset: ## Reset local Supabase and apply schema
	supabase db reset

db-seed: ## Seed Supabase with local JSON dev data
	npx tsx scripts/seed-db.ts

# ── Deployment ───────────────────────────────────────────────────────────────

deploy: ## Deploy to Vercel production
	vercel --prod

deploy-preview: ## Deploy to Vercel preview
	vercel

logs: ## Tail production logs (TARGET=prod or omit)
	vercel logs https://imperfect-sage.vercel.app --follow

status: ## Show Vercel deployment status
	vercel ls $(PROJECT_NAME)

# ── Docs ─────────────────────────────────────────────────────────────────────

docs: ## Serve docs locally
	python3 -m http.server 8080 --directory docs
