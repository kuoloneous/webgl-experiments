#!/bin/bash

# why do this? I always forget, here's a
# link explaning the options:
# https://sipb.mit.edu/doc/safe-shell/
set -uo pipefail

ROOT_DIR=$(cd "$(dirname "$0")/../../"; pwd)

if [ "$#" -ne 1 ] ; then
  echo "Usage: $0 ENVIRONMENT" >&2
  exit 1
fi


BUILD_ENVIRONMENT=$1
export BUILD_TAG=tag

# Create version file.
GIT_SHA=$(git rev-parse HEAD | cut -c 1-8);
DATE_NOW=$(date -u +"%Y-%m-%dT%H:%M:%SZ");
RESOURCE_BUNDLE_ID="$(date +%s):$GIT_SHA";
RESOURCE_BUNDLE_ID_B64=$(echo $RESOURCE_BUNDLE_ID | base64 | tr -d =)

mkdir -p ${ROOT_DIR}/src/dist
echo "[+] Building Version Data: ${GIT_SHA}"
echo "{\"build_environment\": \"${BUILD_ENVIRONMENT}\", \"build_tag\": \"${BUILD_TAG}\", \"sha\": \"${GIT_SHA}\", \"publish_date\": \"${DATE_NOW}\", \"resource_bundle_id\": \"${RESOURCE_BUNDLE_ID_B64}\"}" > ${ROOT_DIR}/src/dist/version.json

# Build docker image
echo "[+] Building Node Application"
docker build -f "${ROOT_DIR}/scripts/docker/Dockerfile" --build-arg NODE_ENV=$1 -t canoo/sauron-frontend $ROOT_DIR
