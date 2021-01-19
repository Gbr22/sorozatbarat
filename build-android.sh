cp -rf -T node_modules_patch node_modules
cd android
./gradlew --console plain assembleRelease
