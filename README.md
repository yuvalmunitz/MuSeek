# Welcome to the MuSeek Web App Project!

MuSeek is a web application that allows users to create and share music-related content. This README provides instructions for setting up and running the project, as well as information about the database structure and deployment options.

## Table of Contents
- [Available Scripts](#available-scripts)
- [Database Structure](#database-structure)
- [Install Firebase SDK](#install-firebase-sdk)

## Available Scripts

In the project directory, you can run:

### `npm install`

Installs the necessary dependencies for the project.

### `npm start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `yarn start`

Runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes. Your app is ready to be deployed! See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However, we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

---
## Database Structure
#### Users Collection - Posts Collection - Comments Sub-collection
[Database Diagram](docs/database-diagram.md)

---
## Install Firebase SDK:
```
npm install firebase
```

## Deploy to Firebase Hosting (Optional)
1. Install Firebase CLI if you haven’t already:
```
npm install -g firebase-tools
```

2. Log in to Firebase:
```
firebase login
```

3. Initialize Firebase in your project:
```
firebase init
```
4. Follow the prompts to set up Firebase Hosting.
5. Deploy your app:
```
npm run build
firebase deploy
```