#!/bin/bash
set -e
cd "$(dirname "$0")"
if [ "$(uname -s)" != "Darwin" ]; then
  echo "Use o instalador correspondente ao seu sistema operacional."
  exit 1
fi
exec /bin/bash ferramentas/instalador/bootstrap-unix "$@"
