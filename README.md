# Overview

This project demonstrates a Salesforce Canvas application. This component is an open grid that is not page specific. A SF Canvas app is a wrapper around a third party application that is independently hosted, and loaded into SF through it's url (including localhost!). This specific component utilizes an Aura component to house the force:canvas component. The Aura component is passing in the pages record Id for use in the Canvas app.

This repo has three main parts:  
1: nginx server in the server folder  
2: react client application in client folder  
3: salesforce Aura component in the force-app folder

This project does not have proper error handling or full unit testing, and is currently for example only. This project uses local storage to save component specific schema data.

## Get it running

#### Prerequisites

1: Salesforce Dev Sandbox  
2: NodeJS installed
3: NPM installed

#### Create a new connected component in salesforce

**From Salesforce Setup**  
1: Navigate to the `App Manager` in `Setup` and click `New Connected App`.  
2: Fill in the required basic info at the top and take note of the `API Name` field, this will be used in your code  
3: Enable OAuth Settings, enter `http://localhost:3000` for the `Callback URL`, and select the `Full Access` for OAuth Scopes (More expermentation needed here)  
4: Scroll to the bottom and enable `Canvas`. Enter `http://localhost:3000/sign` for the Canvas App URL. Make sure the access method is `Signed Request(POST)`. Under `Locations`, add `Lightning Component`  
5: Hit `save`
6: Click back into the "View" of the connected app and click Manage
7: Under OAuth Policies, "Admin approved users are pre-authorized" is selected, and choose Relax IP Restriction so localhost works.
8: Under Profiles, add the profiles that can use the connected app

#### Create and Deploy the Canvas App

**From your Deployment tool of choice**  
1: In this repo, under `force-app/main/default/aura/OpenGridComponent`, open `OpenGridComponent.cmp` and make sure the `developerName` attribute matches the API name you used creating the app in SF.  
2: Deploy the OpenGridComponent folder to your dev org. In this folder, the interesting files are the `OpenGridComponent.cmp` and the `OpenGridComponent.js`. All other files are default when making a new Aura component.

#### Starting up Localhost

**From the terminal**  
1: from the project root, `npm i`, then start the nginx server `npm run start`  
2: from a new terminal, `cd client` and run `npm i`, then start the react app `npm run watch`

note: `npm run watch` creates a production build and deploys it to the build dir. The server loads the build static files when the endpoint is hit. If you need better debugging details, stop the watch, and run `npm run start`.

#### Add Canvas App to SF Page

**From SF Agreement Record Page**  
1: Go into page Edit mode  
2: Add the newly created component to the page  
3: Save, go back, and the view the component on the page, happy hacking!

#### Unit Tests

This application utilizes React Testing Library and Jest for unit testing. From the Client dir, running `npm run test` will launch the test runner and run the tests.

#### Deploying to Heroku

1: Make sure you have your own fork of this repo for easy Heroku deployment  
2: Create a new Heroku project, and point the deployment to the git repo. Heroku will automatically recognize the application structure and can deploy it without any customization.  
3: To see the published application, go to the canvas app settings in SF Setup, and change all `http://localhost:3000` urls to the secure url of your published heroku site.

## About the app

The server is an njinx server with two endpoints. One redirects all requests to the react apps build folder. The other takes the `post` to the sign endpoint, and redirects to the `/` root.

The `post` request includes a signed request from Salesforce, but since this isn't a server rendered application, we cannot use it to serve our content. We should however validate that the signed request is valid by using the canvas apps consumer secret (TODO).

The client is a react application using functional components. The app utilizes the [Salesforce Canvas sdk](https://github.com/forcedotcom/SalesforceCanvasJavascriptSDK). The first thing the app does is request a signed request. Typically you should validate the request based on it's signature and your consumer key, however since this is loaded in the app, this doesn't seem necessary.

The signed request is illustrated in the `sampleCanvasReq.json` file in the Client dir. Contains user info, the OAuth token, relative links for the Salesforce API, and the record Id under `parameters` that we passed in through the Aura app.

The app has examples of Apex requests, entity definition requests, and graphql requests
