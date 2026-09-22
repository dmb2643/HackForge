-include .env

up:
	@docker compose up -d $(container)
	@if [ -z "$(container)" ]; then docker compose logs -f backend; fi


down:
	@docker compose down frontend backend nginx

build:
	@docker compose up --build backend

create-migration:
	@docker compose run --rm migrator \
	    create \
		-ext sql \
		-dir /migrations \
		-seq $(name)

migrate:
	@docker compose run --rm migrator \
	    -path /migrations \
		-database postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable \
		$(action)


clear-db:
	@docker compose down && \
		rm -r out/postgres

test:
	go -C backend test ./...
