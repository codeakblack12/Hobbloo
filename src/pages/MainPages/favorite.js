import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import { ButtonGroup } from 'react-native-elements/dist/buttons/ButtonGroup';

import FavoriteItems from '../FavoritePages/items';
import FavoriteBaskets from '../FavoritePages/baskets';

var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;

export default function FavoritePage() {

  const [topbarState,settopbarState] = useState(0);

  const updateIndex = (index) => {
    settopbarState(index)
  }

  

  return (
    <View style={[styles.container, {backgroundColor: APP_COLORS.background_color}]}>
      <View style={{width: screenWidth, height: 50, backgroundColor: APP_COLORS.background_color, marginTop: 0, alignItems: "center", justifyContent: "center"}}>
        <ButtonGroup
        selectedButtonStyle={{backgroundColor: "#3c1361", borderRadius: 0}}
        selectedTextStyle={{color: "#fff"}}
        buttonStyle={{backgroundColor: "#bca0dc"}}
        textStyle={{color:"#3c1361", fontSize: 12}}
        onPress={updateIndex}
        selectedIndex={topbarState}
        buttons={['Items','Baskets']}
        containerStyle={{height: 38, borderWidth: 0, borderRadius: 8, width: screenWidth * 0.9, backgroundColor: "#3c1361"}}
        buttonContainerStyle={{backgroundColor: "#3c1361"}}
        innerBorderStyle={{width: 0}}
        />
      </View>

      {topbarState == 0 ? (<FavoriteItems />):(<FavoriteBaskets />)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
