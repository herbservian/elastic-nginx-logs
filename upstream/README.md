# Random NGINX logs
This little program will automatically generate upstream request logs to simulate MITRE attack framework events

To run this locally, 
```bash
yarn install

node main.js
```

the output file `access.log` will contain a row per log entry.

## Running in Docker

To run the docker version of this project, do the following from the source directory:

```bash
sudo docker build -t nginx_uptream_logs:latest . 
```

To run the container:
```bash
sudo docker run --rm -ti -e ES_HOST="0.0.0.0:9200" -e NODE_VERBOSE=true -e FILEBEAT_VERBOSE=true -e START=1000 -e RANGE=5000 nginx_uptream_logs

sudo docker run --rm -ti -e CLOUD_ID="deployment:YXVzdHJhbGlhLXNvdXRoZWFzdDEuZ2NwLmVsYXN0aWMtY2xvdWQuY29tJDcxMWRlNmJkMGU1NTQ4N2RhYzdji" -e CLOUD_AUTH="elastic:<your_password>" -e NODE_VERBOSE=true -e FILEBEAT_VERBOSE=true -e START=1000 -e RANGE=5000 nginx_uptream_logs
```
The above command requires a few environment variables:
* `ES_HOST` is the fully qualified URL to connect to your Elasticsearch instance, e.g. `http://elasticsearch.mycoolwebsite:9200`
* `NODE_VERBOSE` set to `true` will make node log the message it appends to the nginx log. To disable this remove the environment variable completely.
* `FILEBEAT_VERBOSE` set to `true` will make filebeat output its healthcheck and status messages. To disable this remove the environment variable completely.
* `START` and `RANGE` set the period in which the simulated attack will begin. For example setting `START=1000` and `RANGE=1000` means the attack will start between 1 and 2 seconds after the container starts. The default value for these is 1 minute for each.
