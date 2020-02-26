# APM Demo
Nginx generator with apm functionality


## Running in Docker

To run the docker version of this project, do the following from the source directory:

```bash
sudo docker build -t apm_demo:latest . 
```

To run the container:
```bash

sudo docker run --rm -ti -e NODE_VERBOSE=true -e START=1000 -e RANGE=5000 apm_demo
```
The above command requires a few environment variables:
* `NODE_VERBOSE` set to `true` will make node log the message it appends to the nginx log. To disable this remove the environment variable completely.
* `START` and `RANGE` set the period in which the simulated attack will begin. For example setting `START=1000` and `RANGE=1000` means the attack will start between 1 and 2 seconds after the container starts. The default value for these is 1 minute for each.
