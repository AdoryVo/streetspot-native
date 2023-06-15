# 🏙️ streetspot-native

A platform for citizens to report local infrastructure issues and improve their city.  
Built with React Native and Expo for mobile compatibility.  
*Idea from SD Hacks 2021 project (https://github.com/AdoryVo/streetspot-2021)*

## 🚀 Development

### Setup

1. Clone the repo (`git clone https://github.com/AdoryVo/streetspot-native.git`)
2. Open your local repo folder in VS Code
3. Open a new terminal (`` Ctrl+` ``) & run `npm install` to install dependencies
4. Add a `.env` file to the root directory & set `GOOGLE_MAPS_API_KEY=[your local unrestricted Google Cloud api key here]`.
5. Open a new terminal (`` Ctrl+Shift+` ``) and run `npm run web` to start and test the app for the web.
6. Open [http://localhost:19006](http://localhost:19006) with your browser to see the result.

## 🥞 Stack

### Major functionality
- [React Native & Expo](https://docs.expo.dev/get-started/create-a-project/) - Foundation and core SDK for native features
- [React Navigation](https://reactnavigation.org/) - Routing and navigation
- [Firebase](https://firebase.google.com/) (Storage & Realtime Database) - Cloud storage for images and reports

### UI
- [@react-google-maps/api](https://react-google-maps-api-docs.netlify.app/) - Google Maps React components
- [react-hook-form](https://www.react-hook-form.com/) - Form logic
- [react-responsive](https://www.npmjs.com/package/react-responsive) - Mobile responsive media queries
- [react-select](https://react-select.com) - Select component
- [react-wrap-balancer](https://react-wrap-balancer.vercel.app/) - Text content wrap balancing
- [Font Awesome via Expo](https://docs.expo.dev/guides/icons/) - Icons

### Misc
- [prettier](https://prettier.io/) - Code formatting
- [react-native-dotenv](https://www.npmjs.com/package/react-native-dotenv) - .env loading for local development

## ⭐ See also
- [Chain React 2023 App](https://github.com/infinitered/ChainReactApp2023) - Solid reference for a React Native & Expo app
- [Expo's Develop for Web guide](https://docs.expo.dev/workflow/web/) - Instructions for developing for the Web