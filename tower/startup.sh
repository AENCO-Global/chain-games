#!/usr/bin/env bash

echo "Stop previously running services"
kill $(ps -aef | grep SimpleHTTPServer | grep -v 'grep' | awk '{print $2}')

echo "Start the Web Server"
python -m SimpleHTTPServer 8000 &

echo "Start the node websocket engine"
cd server
node main.js

echo "http://localhost:8001 to use the test interface and see transactions"

