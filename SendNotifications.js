import React, {useState, useEffect} from 'react';
import { View, Vibration, Platform, Alert } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import * as firebase from 'firebase';
import 'firebase/firestore';
import * as Linking from 'expo-linking';


const SendNotifications = props => {

  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState([]);

  const db = firebase.firestore();

  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token);
      //use this code to store users token in a db like firebase. If not firebase implement a logic here
      //for example my collection is "myCollection" and document id is user's email address
      //myCollection -> xyz@example.com -> {pushToken:ExpoPushToken[lkjdkjdsdklsndklskd]}
      db.collection("myCollection").doc(firebase.auth().currentUser.email).set({
        pushToken:token
      }, {merge:true}).then(() => {
        console.log('token saved in firebase document xyz@example.com within myCollection');
      });
      //firebase implementation
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.createChannelAndroidAsync('default', {
        name: 'default',
        sound: true,
        priority: 'max',
        vibrate: [0, 250, 250, 250],
      });
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    const _notificationSubscription = Notifications.addListener(_handleNotification);
  }, [notification, expoPushToken])
    
  

  const _handleNotification = notification => {
    Vibration.vibrate();
    setNotification(notification);
    if(notification.origin === 'received') {
      Alert.alert(
        "Notification from MyApp  ",
        "Please click on View to see the notification",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => {
              Linking.openURL('https://expo.io');
          } }
        ],
        { cancelable: false }
      );
    }else if(notification.origin === 'selected'){
      Linking.openURL('https://expo.io');
  }
  };

  

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/dashboard/notifications
  const sendPushNotification = async (receiverToken) => {
    const message = {
      to: receiverToken,
      sound: 'default',
      title: 'Hey! check my notification',
      body: 'Could you please let me know if you received this notification',
      data: { postId: 'slug-1' },
      _displayInForeground: true,
    };
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };


  
    return null;
}

/*  TO GET PUSH RECEIPTS, RUN THE FOLLOWING COMMAND IN TERMINAL, WITH THE RECEIPTID SHOWN IN THE CONSOLE LOGS

    curl -H "Content-Type: application/json" -X POST "https://exp.host/--/api/v2/push/getReceipts" -d '{
      "ids": ["YOUR RECEIPTID STRING HERE"]
      }'
*/

export default SendNotifications;
