#!/bin/bash

tag=$1

# cp /home/gitlab-runner/int.enerdat.ca.crt . &&
# cp /home/gitlab-runner/int.semax.ca.crt . &&
# cp /home/gitlab-runner/metricsx.ca.crt . &&

echo "Building Docker image" && 
docker build -q -t epointwebui:$tag -f ./linux-nb.Dockerfile . || true;

echo "Tagging newly created Docker image" && 
docker tag epointwebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;

echo "Pushing UI Docker image to GitLab" && 
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;

echo "Finished"