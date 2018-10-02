#!/bin/bash

echo "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n"
echo "^^U^^^U^^^GGG^^^L^^^^i^^FFFF^^Y^Y^Y^^^^^^^^^\n"
echo "^^U^^^U^^G^^^G^^L^^^^i^^F^^^^^^Y^Y^^^^^^^^^^\n"
echo "^^U^^^U^^G^^^^^^L^^^^i^^FFF^^^^^Y^^^^^^^^^^^\n"
echo "^^^UUU^^^^GGGG^^LLLL^i^^F^^^^^^^Y^^^^^^^^^^^\n"
echo "^^^^^^^^^^^^^G^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^\n"
file="/opt/jenkins/tools/node_modules/uglify-js/bin/uglifyjs"
if [ -e "$file" ]
then
	echo "$file found. No need to download....."
else
	echo "$file Not found. Retreiving....."
	npm install --prefix /opt/jenkins/tools uglify-js
	wget -O https://github.com/yui/yuicompressor/releases/download/v2.4.8/yuicompressor-2.4.8.jar -P /opt/jenkins/tools/
fi

echo "^^^^^^^^^^^^^^ Start minifing js ^^^^^^^^^^^^^^^^^\n"
find . -name '*.js' ! -name '*-min.*' ! -name '*.min.*' -type f -exec /opt/jenkins/tools/node_modules/uglify-js/bin/uglifyjs "{}" -c 'drop_console=true, warnings=false' -m -o "{}" \;
echo "^^^^^^^^^^^^^^ Start minifing css ^^^^^^^^^^^^^^^^^\n"
find . -type f -name '*.css' ! -name '*-min.*' ! -name '*.min.*' -type f -exec java -jar /opt/jenkins/tools/yuicompressor-2.4.8.jar "{}" -o "{}" \;
echo "^^^^^^^^^^^^^^ End minifing ^^^^^^^^^^^^^^^^^\n"
