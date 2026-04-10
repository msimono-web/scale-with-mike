#!/bin/bash
# ─────────────────────────────────────────────────────────────────
# deploy-cloudrun.sh  —  ScaleWithMike → Google Cloud Run
# Usage : ./deploy-cloudrun.sh
# ─────────────────────────────────────────────────────────────────

set -e

# ── CONFIG (modifie ces 3 variables) ──────────────────────────────
PROJECT_ID="exalted-iridium-492905-a4"  # ton Google Cloud Project ID
REGION="europe-west1"               # région la plus proche (Paris)
SERVICE_NAME="scalewithmike-app"
IMAGE="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo ""
echo "🚀  Déploiement ScaleWithMike → Cloud Run"
echo "   Project : $PROJECT_ID"
echo "   Region  : $REGION"
echo "   Image   : $IMAGE"
echo ""

# 1. Auth check
echo "▶ Vérification de l'authentification gcloud..."
gcloud auth print-identity-token &>/dev/null || {
  echo "⚠  Pas connecté. Lance : gcloud auth login"
  exit 1
}

# 2. Set project
gcloud config set project "$PROJECT_ID"

# 3. Enable APIs (idempotent)
echo "▶ Activation des APIs nécessaires..."
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  containerregistry.googleapis.com \
  --quiet

# 4. Build & push avec Cloud Build (pas besoin de Docker local)
echo "▶ Build de l'image avec Cloud Build..."
gcloud builds submit \
  --tag "$IMAGE" \
  --timeout=15m

# 5. Deploy to Cloud Run
echo "▶ Déploiement sur Cloud Run..."
gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --set-env-vars "NEXT_PUBLIC_SUPABASE_URL=https://yaocmpaobkhhbkcwyoyn.supabase.co,NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_UNHLpvecQ6nQ3gYRMqY5nA_wJRaviq6" \
  --quiet

echo ""
echo "✅  Déployé ! URL :"
gcloud run services describe "$SERVICE_NAME" \
  --region "$REGION" \
  --format "value(status.url)"
