import React, {useEffect} from 'react';
import { StyleSheet, Text, View, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function StoreComplete({navigation}) {

  return (
    <View style={styles.container}>
      <Text>Store Complete</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
