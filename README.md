 A React Native app that allows users to create, manage, and interact with multiple customizable timers. The app will include features like categories, progress
 visualization, and grouped actions while maintaining clean UI/UX and minimal third-party dependencies.

# Getting Started

## Setup Instructions

## Step 1: Clone the repository
gh repo clone AVS-MANIKANTA/Healthflex-timerapp

## Step 2: Install Dependencies

```bash
# using npm
npm install

# OR using Yarn
yarn install
```

## Step 3: Start your Application

### For Android

npx react-native run-android

### For IOS

npx react-native run-ios

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.




### 🔥🔥Core Feature Timer app

- Add Timer and adding multiple categories
- Timer List with Grouping
- Timer Management with all control
- Progress Visualization
- Bulk actions
- User Feedback

### Enhanced Functionality
- Timer History
- Export Timer History Data as JSON file
- Category Filtering
- Removing TImer History

## Release APK of Timer app
- Download the app and check once, it is free😉
- https://drive.google.com/file/d/1c2vHuFw61XDBAa-Hip9MxoZxp0bSKtVN/view?usp=sharing
  
## Folder Structure 
app/
│── components/            # Reusable UI components
│   ├── TimerCard.tsx      # Timer card component
│   ├── ProgressBar.tsx    # Progress bar for timers
│
│── navigation/            # App navigation setup
│   ├── AppNavigator.tsx   # Bottom tabs and stack navigation
│
│── screens/               # App screens
│   ├── HomeScreen.tsx     # Main screen with timer categories
│   ├── AddTimerScreen.tsx # Screen for adding new timers
│   ├── HistoryScreen.tsx  # Screen to view and export timer history
│
│── App.tsx                # Entry point of the app
│── package.json           # Dependencies and scripts
│── README.md              # Project documentation


# Troubleshooting
IF you face issue with react native screen for this version app 0.74, see the --> https://github.com/software-mansion/react-native-screens/issues/2114



# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
