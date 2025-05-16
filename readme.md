# Carpool

CS 188 project

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
2. In the `/server` directory run `node server.ts`.

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
