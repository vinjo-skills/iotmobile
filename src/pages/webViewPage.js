import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Button,
} from "react-native";
import { WebView } from "react-native-webview";

export default function WebViewPage() {
  const webViewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const onMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === "error") {
      Alert.alert("Error", data.message);
    }
    if (data.type === "submit") {
      fetch("http://192.168.4.1/wifi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ssid: data.ssid, password: data.password }),
      })
        .then((response) => response.text())
        .then((message) => {
          Alert.alert("Response from Pico", message);
        })
        .catch((error) => {
          console.error("Error:", error);
          Alert.alert("Error", "Failed to send credentials.");
        });
    }
  };

  const fetchNetworks = () => {
    const fetchNetworksScript = `
      document.getElementById('networks').innerHTML = '<option>Loading...</option>';
      fetch('http://192.168.4.1/networks')
        .then(response => response.json())
        .then(data => {
          const select = document.getElementById('networks');
          select.innerHTML = '';
          data.forEach(network => {
            const option = document.createElement('option');
            option.value = network.ssid;
            option.textContent = network.ssid;
            select.appendChild(option);
          });
        })
        .catch(error => {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'error',
            message: 'Failed to fetch networks: ' + error.message
          }));
        });
    `;
    webViewRef.current.injectJavaScript(fetchNetworksScript);
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* <Button title="Refresh Networks" onPress={fetchNetworks} /> */}
      <WebView
        ref={webViewRef}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                    margin: 0;
                    background-color: #fff;
                  }
                  h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 24px;
                    color: #333;
                  }
                  select, button {
                    display: block;
                    width: 100%;
                    margin: 15px 0;
                    padding: 12px;
                    font-size: 18px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                  }
                  input {
                    display: block;
                    width: 94%;
                    margin: 15px 0;
                    padding: 12px;
                    font-size: 18px;
                    border-radius: 8px;
                    border: 1px solid #ccc;
                  }
                  button {
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                  }
                  button:hover {
                    background-color: #0056b3;
                  }
                  select {
                    background-color: #fff;
                  }
                  input {
                    background-color: #fff;
                  }
                </style>
              </head>
              <body>
                <h2>Connect to vinjo Network</h2>
                <label for="networks">Available Networks:</label>
                <select id="networks">
                  <option>Loading...</option>
                </select>
                <label for="password">Password:</label>
                <input type="password" id="password" placeholder="Enter Wi-Fi Password" />
                <button onclick="submitCredentials()">Connect</button>
                <button onclick="fetchNetworks()">Fetch Networks</button>
                <script>
                  function submitCredentials() {
                    const ssid = document.getElementById('networks').value;
                    const password = document.getElementById('password').value;
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'submit',
                      ssid: ssid,
                      password: password
                    }));
                  }

                  function fetchNetworks() {
                    document.getElementById('networks').innerHTML = '<option>Loading...</option>';
                    fetch('http://192.168.4.1/networks')
                      .then(response => response.json())
                      .then(data => {
                        const select = document.getElementById('networks');
                        select.innerHTML = '';
                        data.forEach(network => {
                          const option = document.createElement('option');
                          option.value = network.ssid;
                          option.textContent = network.ssid;
                          select.appendChild(option);
                        });
                      })
                      .catch(error => {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                          type: 'error',
                          message: 'Failed to fetch networks: ' + error.message
                        }));
                      });
                    }
                </script>
              </body>
            </html>
          `,
        }}
        onMessage={onMessage}
        onLoadEnd={() => {
          setLoading(false);
          fetchNetworks();
        }}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  webview: {
    flex: 1,
    marginTop: 10,
  },
});
