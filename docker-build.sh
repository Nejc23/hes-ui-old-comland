#!/bin/bash

tag=$1
DOCKER_USER=$2
DOCKER_PASSWORD=$3
DOCKER_REGISTRY=$4
DOCKER_REGISTRY_PATH=$5

echo "Step 1: Login to GitLab" &&
echo "DOCKER_REGISTRY: ${DOCKER_REGISTRY} - DOCKER_REGISTRY_PATH: ${DOCKER_REGISTRY_PATH}" &&
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USER" --password-stdin $DOCKER_REGISTRY &&

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
docker tag epointwebui:$tag $DOCKER_REGISTRY_PATH/epointwebui:$tag || true;
docker tag amerawebui:$tag $DOCKER_REGISTRY_PATH/amerawebui:$tag || true;
docker tag mygridwebui:$tag $DOCKER_REGISTRY_PATH/mygridwebui:$tag || true;

echo "Step 4: Pushing UI Docker images to GitLab" &&
docker push -q $DOCKER_REGISTRY_PATH/epointwebui:$tag || true;
docker push -q $DOCKER_REGISTRY_PATH/amerawebui:$tag || true;
docker push -q $DOCKER_REGISTRY_PATH/mygridwebui:$tag || true;

echo "Finished"
