import React, {useState} from 'react';
import {View, Button, StyleSheet} from 'react-native';
import SendNotifications from './SendNotifications';

export default App() {
  const [sendMessage, setSendMessage] = useState(false);
  const [token, setToken] = useState('');
  
  let message;
  const sendNotification = () => {
    message = {
      to: token,
      sound: 'default',
      title: 'Hey! check my notification',
      body: 'Could you please let me know if you received this notification',
      data: { postId: 'slug-1' },
      _displayInForeground: true,
    };
  }
  
  return (
    <View style={styles.screen}>
      <TextInput value={token} onChangeText={(inputToken) => setToken(inputToken)} label="Input Receivers Token" />
      <Button title="Send Notification" onPress={() => sendNotification()} />
    </View>
  );
};
        
const styles = StyleSheet.create({
  screen:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  }
});
