
if [ -n "${FILEBEAT_VERBOSE}" ] ; then
  ./filebeat/filebeat -e -c filebeat/filebeat.yml -E output.elasticsearch.hosts="${ES_HOST}" &
else
  ./filebeat/filebeat -c filebeat/filebeat.yml -E output.elasticsearch.hosts="${ES_HOST}" &
fi

node main.js