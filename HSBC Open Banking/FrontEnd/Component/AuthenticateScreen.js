import React, { useState, useEffect, useRef } from "react";
import { Text } from "react-native";
import { WebView } from "react-native-webview";

/* OAuth2.0 Authentication URL  */

const AuthenticateScreen = ({ navigation }) => {
  const [hsbcUrl, setHsbcUrl] = useState();
  const webViewRef = useRef(null);

  useEffect(() => {
    if (!hsbcUrl) {
      fetch("http://10.0.2.2:8000/token/")
        .then((response) => {
          setHsbcUrl(response.url);
        })

        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  if (hsbcUrl) {
    console.log(hsbcUrl);
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: hsbcUrl }}
        onNavigationStateChange={(event) => {
          if (event.url !== hsbcUrl) {
            if (event.url.indexOf("authenticate?code=") != -1) {
              webViewRef.current.stopLoading();
              navigation.navigate("User", {
                backEndCode: event.url.split("authenticate?code=")[1],
              });
            }
          }
        }}
      />
    );
  }
  return <Text>Loading...</Text>;
};

export default AuthenticateScreen;
