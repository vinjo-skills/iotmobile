import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Divider } from "@ui-kitten/components";

export default function WifiSetup() {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("click button for loading...");
  const [fetchresponse, setFetchResponse] = useState(
    "click button for loading..."
  );
  const [loading, setloading] = useState(false);
  useEffect(() => {
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => {
        setNetworks(response.data);
        setloading(true);
      })
      .catch((err) => {
        setloading(true);
        alert("please connect to vinjo network");
      });
  }, []);

  const sendCredentials = () => {
    const data = { ssid: selectedNetwork, password };
    axios
      .post("http://192.168.4.1/wifi", data)
      .then((res) => console.log(res.data))
      .catch((err) => console.error("Error sending credentials:", err));
  };

  const refreshNetworks = () => {
    setResponse("Loading...");
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => setResponse(JSON.stringify(response.data)))
      .catch((err) => setResponse(JSON.stringify(err)));
  };

  const refreshByFetch = () => {
    setFetchResponse("Loading...");
    fetch("http://192.168.4.1/networks")
      .then((response) => response.json())
      .then((data) => {
        setFetchResponse(JSON.stringify(data));
      })
      .catch((error) => {
        setFetchResponse(JSON.stringify(error));
      });
  };

  return (
    <ScrollView>
      <View style={{ padding: 20, backgroundColor: "white" }}>
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
        <Divider />

        <View
          style={{
            backgroundColor: "lightgray",
            padding: 10,
            marginVertical: 10,
            height: 200,
          }}
        >
          <Text style={{ height: 150 }}>{response} </Text>
          <Button title="Referesh" onPress={refreshNetworks} />
        </View>

        <Divider />

        <View
          style={{
            backgroundColor: "lightgray",
            padding: 10,
            marginVertical: 10,
            height: 200,
          }}
        >
          <Text style={{ height: 150 }}>{fetchresponse}</Text>
          <Button title="Referesh By Fetch" onPress={refreshByFetch} />
        </View>
      </View>
    </ScrollView>
  );
}
