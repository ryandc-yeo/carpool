# Carpool

CS 188 project

<img src="https://github.com/ryandc-yeo/carpool/raw/main/client/assets/images/logo.png" alt="Carpool Logo" width="200"/>

## Setup Instruction

Clone the repo with:

```bash
git clone https://github.com/ryandc-yeo/carpool.git
```

Install dependencies:

```bash
cd client && npm i && cd ../server && npm i && cd ..
```

## Running the application

You should create two terminals:

1. In the `/client` directory run `npx expo start`. You can choose to scan the QR code with the Expo Go app on your phone, but I'd recommend using a simulator from XCode or Android Studio.
3. In the `/server` directory run `node server.ts`.

## Tech Stack

- React Native
- Express
- Firebase

## Passenger Flow
1. Click menu and navigate to Login to sign up
2. Fill in phone number and enter in six-digit code to verify phone number
3. Create profile by filling in name, grade, and address information
4. Rides Home: displays information about signup deadlines and will allow passengers to sign up for rides
5. Rides Signup page: click passenger and fill in information about rides sign-up
6. Upon submit, passengers will be navigated to Passenger Home, where they can see their car and driver details. They have to confirm their ride. From this page, they can edit their sign up, view all rides, and open their driver chat.

### Checking ride details as a PASSENGER
1. Login to your account by verifying your phone number.
2. You will be brought to the Rides Home page, which now shows the View Ride button. Click on that to see your ride details.
3. You will be brought to the Passenger Home page, where you will immediately see important details such as your Driver's name, pickup address, and pickup time. It is essential for you to click `Acknowledge Pickup Time` to confirm your seat in that car. Failing to do so may lead to your seat being replaced.
4. On the same page, you can also click `View All Rides` to check all other ride assignments.

## Troubleshooting

If you're having issues connecting to Firebase Firestore or an endless loading screen when initializing the app on Expo Go, here are two possible fixes:
- Make sure you're connected to a secure network. Insecure public networks like UCLA_WEB can't connect to Firebase.
- If using Expo Go, make sure both devices are connected to the same network.
- Or try running `npx expo start --tunnel`
