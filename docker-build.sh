#!/bin/bash

tag=$1
CI_REGISTRY_USER=$2
CI_REGISTRY_PASSWORD=$3
CI_REGISTRY=$4

echo "Step 1: Login to GitLab" &&
docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY &&

cp /home/gitlab-runner/int.enerdat.ca.crt . &&
cp /home/gitlab-runner/int.semax.ca.crt . &&
cp /home/gitlab-runner/metricsx.ca.crt . &&

echo "Step 2: Building Docker images" &&
echo "Building started for e-Point.HES dist" &&
docker build -q -t epointwebui:$tag -f ./linux-nb.epointhes.Dockerfile . || true;
echo "Building started for Amera dist" &&
docker build -q -t amerawebui:$tag -f ./linux-nb.amera.Dockerfile . || true;
echo "Building started for myGrid dist" &&
docker build -q -t mygridwebui:$tag -f ./linux-nb.mygrid.Dockerfile . || true;

echo "Step 3: Tagging newly created Docker images" &&
docker tag epointwebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;
docker tag amerawebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/amerawebui:$tag || true;
docker tag mygridwebui:$tag registry.gitlab.enerdat.com/enerdat/epoint.hes/mygridwebui:$tag || true;

echo "Step 4: Pushing UI Docker images to GitLab" &&
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/epointwebui:$tag || true;
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/amerawebui:$tag || true;
docker push -q registry.gitlab.enerdat.com/enerdat/epoint.hes/mygridwebui:$tag || true;

echo "Finished"
