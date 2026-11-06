#!/bin/sh
# Wonder World on a Mac or Linux computer with no internet: serves this folder at http://localhost:8787 and opens it.
cd "$(dirname "$0")"
( sleep 1; open http://localhost:8787/ 2>/dev/null || xdg-open http://localhost:8787/ ) &
echo "Wonder World is running at http://localhost:8787 - keep this window open."
python3 -m http.server 8787 --bind 127.0.0.1
