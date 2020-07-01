# expo-notification-demo

Hello Expo users! I created this functional component as there were no examples available on Expo Documentation regarding Notifications API in functional component with custom function handler. This function serves 3 purposes - register for push token and save the token to firebase (you can add your own db), listen for notifications, send notification to any user.

Go to your App.js or root level component and import SendNotifications from your saved location like this :

import SendNotifications from './SendNotifications';

and mount it anywhere on the root component as 

<SendNotification sendMessage={true} token={token} message={message} />

Please note that props actions and descriptions - 

Since this is the single component for all your Notification needs it returns null. So for registering the token and saving it to db just mount it like - 

<SendNotification sendMessage={false} token={null} message={null} />

If you want to send a notification to an user, then pass the token and message to these props and toggle sendMessage to true.

<SendNotification sendMessage={true} token={token} message={message} />


Example :

See App.js for implementation.
