
if [ -n "${FILEBEAT_VERBOSE}" ] ; then
  ./filebeat/filebeat -e -c filebeat/filebeat.yml -E cloud.id="${CLOUD_ID}" -E cloud.auth="${CLOUD_AUTH}" &
else
  ./filebeat/filebeat -c filebeat/filebeat.yml -E cloud.id="${CLOUD_ID}" -E cloud.auth="${CLOUD_AUTH}" &
fi

node main.js