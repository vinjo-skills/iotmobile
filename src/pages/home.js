import { View, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { Divider, List, ListItem, Text, Calendar } from "@ui-kitten/components";
import axios from "axios";

const Home = () => {
  const [eventData, setEventData] = useState([]);
  const [date, setDate] = useState(new Date());

  const renderItem = ({ item, index }) => (
    <ListItem title={`${index + 1} - ${item.Event}`} />
  );

  useEffect(() => {
    axios
      .get(
        "https://script.google.com/macros/s/AKfycbwgx2JOjXjCuteDLIgs170MGM--eiCqHbjrMb9rVpu13c0IUWbqIKkGScU_0f2x3fuS/exec?path=Sheet1&action=read"
      )
      .then((response) => {
        // console.log(response.data.data);
        setEventData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text} category="h1">
        All events
      </Text>

      <View>
        <Calendar date={date} onSelect={(nextDate) => setDate(nextDate)} />
      </View>
      <View style={styles.listContent}>
        <List
          data={eventData}
          renderItem={renderItem}
          contentContainerStyle={styles.contentContainer}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column",
    alignContent: "center",
  },
  listContent: {
    height: 200,
  },
});
export default Home;
