import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

async function loadNovels() {
  const searchUrl = `http://192.168.43.217:3000/novels`;

  return axios.get(searchUrl);
}

export default class App extends React.Component {
  state = {
    page: 0,
    items: [],
  };
  componentDidMount() {
    // console.log(loadNovels());
    loadNovels()
      .then((res) => this.setState({ items: res.data.items }))
      .catch((err) => console.log(err));
  }
  render = () => {
    const { items } = this.state;
    return (
      <ScrollView>
        {items && items.map((item) => <Item {...item} key={item.id} />)}
      </ScrollView>
    );
  };
}

const Item = (props) => (
  <View style={styles.novelContainer}>
    <Text style={styles.novelName}>{props.name}</Text>
    <Image style={styles.imageStyle} source={{ uri: props.coverUrl }} />
    <Text>{props.synopsis}</Text>
    <Text>{props.slug}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  imageStyle: { width: "140px", height: "170px" },
  novelContainer: { marginBottom: "25px" },
  novelName: { fontWeight: "bold" },
});
