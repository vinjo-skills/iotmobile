import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function WifiSetup() {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Fetch available networks from Pico
    fetch("http://192.168.4.1/networks")
      .then((res) => {
        setNetworks(res.json());
        console.log(res.json());
      })
      .then((data) => setNetworks(data))
      .catch((err) => console.error("Error fetching networks:", err));
  }, []);

  const sendCredentials = () => {
    const data = { ssid: selectedNetwork, password };
    fetch("http://192.168.4.1/wifi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.text())
      .then((message) => alert(message))
      .catch((err) => console.error("Error sending credentials:", err));
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Select a Wi-Fi Network</Text>
      <Picker
        selectedValue={selectedNetwork}
        onValueChange={(value) => setSelectedNetwork(value)}
      >
        {networks.map((network, idx) => (
          <Picker.Item
            label={`${network.ssid} (Signal: ${network.rssi})`}
            value={network.ssid}
            key={idx}
          />
        ))}
      </Picker>
      <TextInput
        placeholder="Enter Wi-Fi Password"
        secureTextEntry
        style={{ borderWidth: 1, marginVertical: 10, padding: 10 }}
        onChangeText={setPassword}
      />
      <Button title="Connect to Wi-Fi" onPress={sendCredentials} />
    </View>
  );
}
