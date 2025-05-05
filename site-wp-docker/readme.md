# Example Site

Description of example site

## Usage

Start Docker containers as background processes.

```sh
docker compose up -d
```

Visit the site at [`http://localhost:3333`](http://localhost:3333). Optionally change the default port number `3333` in the config file `docker-compose.yml` to run multiple applications.

The first time the `wordpress` container is run, it installs the newest version of WordPress.

Stop the containers.

```sh
docker compose down
```

List all running Docker processes.

```sh
docker ps
```

Start Bash shell session in the container.


```sh
docker compose run --rm cli sh
```

Run WP-CLI.

```sh
docker compose run --rm cli wp
```
