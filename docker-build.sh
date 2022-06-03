#!/bin/bash

tag=$1

# cp /home/gitlab-runner/int.enerdat.ca.crt . &&
# cp /home/gitlab-runner/int.semax.ca.crt . &&
# cp /home/gitlab-runner/metricsx.ca.crt . &&

echo "Step 1: Building Docker images" &&
echo "Building started for e-Point.HES dist" &&
docker build -q -t epointwebui:$tag -f ./linux-nb.epointhes.Dockerfile . || true;
echo "Building started for Amera dist" &&
docker build -q -t amerawebui:$tag -f ./linux-nb.amera.Dockerfile . || true;
echo "Building started for myGrid dist" &&
docker build -q -t mygridwebui:$tag -f ./linux-nb.mygrid.Dockerfile . || true;

echo "Step 2: Tagging newly created Docker images" &&
docker tag epointwebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;
docker tag amerawebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/amerawebui:$tag || true;
docker tag mygridwebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/mygridwebui:$tag || true;

echo "Step 3: Pushing UI Docker images to GitLab" &&
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/amerawebui:$tag || true;
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/mygridwebui:$tag || true;

echo "Finished"
