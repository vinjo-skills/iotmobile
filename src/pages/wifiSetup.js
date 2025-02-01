import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Divider, Button, Spinner } from "@ui-kitten/components";

export default function WifiSetup({ navigation, route }) {
  const [networks, setNetworks] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("click button for loading...");
  const [loading, setloading] = useState(false);
  useEffect(() => {
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => {
        setNetworks(response.data);
      })
      .catch((err) => {
        alert("please connect to vinjo network");
      })
      .finally(setloading(false));
  }, []);

  const sendCredentials = () => {
    const data = { ssid: selectedNetwork, password };

    if (!password) alert("Please enter a valid password");

    axios
      .post("http://192.168.4.1/wifi", data)
      .then((res) => console.log(res.data))
      .catch((err) => console.error("Error sending credentials:", err));
  };

  const refreshNetworks = () => {
    setloading(true);
    axios
      .get("http://192.168.4.1/networks")
      .then((response) => setResponse(JSON.stringify(response.data)))
      .catch((err) => setResponse(JSON.stringify(err)))
      .finally(() => setloading(false));
  };

  return (
    <ScrollView>
      <View style={{ flex: 1, padding: 20, backgroundColor: "white" }}>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          Select a Wi-Fi Network
        </Text>
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

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <Button onPress={sendCredentials}>Connect</Button>
          <Button
            status="warning"
            appearance="outline"
            onPress={refreshNetworks}
          >
            Refresh
          </Button>
          <Button
            status="warning"
            appearance="outline"
            onPress={() => navigation.navigate("Home")}
          >
            See All envents
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}
