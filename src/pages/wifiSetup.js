import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Divider } from "@ui-kitten/components";

export default function WifiSetup() {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  useEffect(() => {
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => setNetworks(response.data))
      .catch((err) => alert("please connect to vinjo network"));
  }, []);

  const sendCredentials = () => {
    const data = { ssid: selectedNetwork, password };
    axios
      .post("http://192.168.4.1/wifi", data)
      .then((res) => console.log(res.data))
      .catch((err) => console.error("Error sending credentials:", err));
  };

  const refreshNetworks = () => {
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => setResponse(response.data))
      .catch((err) => setResponse(err));
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
      <TextInput>{JSON.stringify(response)} </TextInput>
      <Button title="Connect to Wi-Fi" onPress={sendCredentials} />
      <Divider />
      <Button title="Referesh" onPress={refreshNetworks} />
    </View>
  );
}
