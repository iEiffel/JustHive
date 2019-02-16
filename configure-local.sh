if [ $# -gt 0 ]
then
  IP=$1
else
  IP=$(ipconfig getifaddr en1)
fi
sed -i '' -e "s/URLWithString:@\"http\:\/\/[^/]*/URLWithString:@\"http\:\/\/$IP:8081/g" ios/WonderBee/AppDelegate.m
sed -i '' -e "s/stringWithFormat:@\"http\:\/\/[^/]*/stringWithFormat:@\"http\:\/\/$IP:%zd/g" node_modules/react-native/Libraries/WebSocket/RCTWebSocketExecutor.m
sed -e "s/http\:\/\/192\.168\.[^:/]*/http\:\/\/$IP/g" appconfig.js.example > appconfig.js
sed -i '' -e "s/http\:\/\/localhost/http\:\/\/$IP/g" appconfig.js
