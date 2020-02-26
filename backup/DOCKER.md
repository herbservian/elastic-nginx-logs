# Troubleshooting Docker

## Docker images
```bash
sudo docker images
sudo docker rmi nginx_uptream_logs
sudo docker rmi node
sudo docker rmi nginxlogs
```

## Anything dangling
```bash
sudo docker system prune
```
WARNING! This will remove:
  - all stopped containers
  - all networks not used by at least one container
  - all dangling images
  - all dangling build cache


## Container
```bash
sudo docker ps -a
sudo docker rm b51b31d219d9
``` 