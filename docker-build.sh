#!/bin/bash

tag=$1

cp /home/gitlab-runner/int.enerdat.ca.crt . &&
cp /home/gitlab-runner/int.semax.ca.crt . &&
cp /home/gitlab-runner/metricsx.ca.crt . &&

docker build -q -t epointwebui:$tag -f ./linux-nb.Dockerfile . || true;
