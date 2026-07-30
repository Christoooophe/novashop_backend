set -euo pipefail
BASE="${BASE_URL:-http://localhost:5000}"
echo "Smoke test sur $BASE"
# 1) Attendre la readiness : 30 essais x 2 s = 1 min max
for i in $(seq 1 30); do
  if curl -fsS "$BASE/health" >/dev/null 2>&1; then
   echo "OK app prete (essai $i)"; break
  fi
  echo "en attente... ($i/30)"; sleep 2
  [ "$i" -eq 30 ] && { echo "KO l'app n'a jamais repondu"; exit 1; }
done

# 2) /health : code 200 ET base jointe
code=$(curl -s -o body.json -w "%{http_code}" "$BASE/health")
[ "$code" = "200" ] || { echo "KO /health = $code"; exit 1; }
grep -q '"status":"up"' body.json || { echo "KO base down"; cat body.json; exit 1; }

# 3) Parcours vital : le catalogue renvoie au moins un produit
curl -fsS "$BASE/api/products" | jq -e '.[0].id' >/dev/null \
  || { echo "KO catalogue vide/injoignable"; exit 1; }

echo "SMOKE OK"

