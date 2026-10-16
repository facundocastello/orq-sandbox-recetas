FROM alpine:3.20
RUN apk add --no-cache sqlite
COPY seed.sql /seed.sql
# Seed once (the volume keeps data across restarts), then idle so `docker exec` can reach it.
CMD ["sh", "-c", "[ -f /data/.seeded ] || (sqlite3 /data/prod.db < /seed.sql && touch /data/.seeded); exec sleep infinity"]
