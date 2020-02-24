# Random NGINX logs

This mini program will generate log files for random routes on an Nginx server, from random IP addresses around the world.

After some time, between 1 - 2 minutes, a fake "attack" will start, with much faster requests incoming to your server from North Korean IP addresses.

To run this locally, 
```bash
yarn install

node main.js
```

the output file `access.log` will contain a row per log entry.

## Running in Docker

Install docker on Ubuntu 18.04 LTS
```bash
$ sudo apt-get update
$ sudo apt install apt-transport-https ca-certificates curl software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
$ sudo apt update
$ apt-cache policy docker-ce
$ sudo apt install docker-ce
$ sudo systemctl status docker
```

Output should look like this:
`Output
● docker.service - Docker Application Container Engine
   Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
   Active: active (running) since Thu 2018-07-05 15:08:39 UTC; 2min 55s ago
     Docs: https://docs.docker.com
 Main PID: 10096 (dockerd)
    Tasks: 16
   CGroup: /system.slice/docker.service
           ├─10096 /usr/bin/dockerd -H fd://
           └─10113 docker-containerd --config /var/run/docker/containerd/containerd.toml`

To run the docker version of this project, do the following from the source directory:

```bash
sudo docker build -t nginxlogs:latest . 
```

To run the container:
```bash
sudo docker run --rm -ti -e CLOUD_ID="deploymentid:dXMtZWFzdC0xLmF3cyYyNTc0Mw=" -e CLOUD_AUTH="elastic:YOUR_PASSWORD" -e NODE_VERBOSE=true -e FILEBEAT_VERBOSE=true -e START=1000 -e RANGE=5000 nginxlogs
```
The above command requires a few environment variables:
* `CLOUD_ID` is the Cloud Id provided by Elastic Cloud. You can find this in the deployment section
* `CLOUD_AUTH` is the Cloud username/password provided by Elastic Cloud. This should have been copied and pasted
* `NODE_VERBOSE` set to `true` will make node log the message it appends to the nginx log. To disable this remove the environment variable completely.
* `FILEBEAT_VERBOSE` set to `true` will make filebeat output its healthcheck and status messages. To disable this remove the environment variable completely.
* `START` and `RANGE` set the period in which the simulated attack will begin. For example setting `START=1000` and `RANGE=1000` means the attack will start between 1 and 2 seconds after the container starts. The default value for these is 1 minute for each.
