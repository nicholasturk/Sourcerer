# Sourcerer

<img src="https://www.flaticon.com/svg/static/icons/svg/2306/2306109.svg" alt="Logo" width="" height="80">

<!-- TABLE OF CONTENTS -->

## Table of Contents

-  [About the Project](#about-the-project)
   -  [Built With](#built-with)
-  [Getting Started](#getting-started)
   -  [Prerequisites](#prerequisites)
   -  [Installation](#installation)
-  [How It Works](#roadmap)

<!-- ABOUT THE PROJECT -->

## About The Project

This was my project for the Cooperators insurance company during my 4 month coop. I started off working on this for the first 3 months of the COOP, then built another Vue.js webapp. This project was done from scratch all by myself, with suggestions
and feedback from my co workers who use the app. It is now deployed live on the servers at the company and has an assosiated Jenkins job that runs everynight to read and write data.


Sourcerer is a web application that is designed primarily for viewing information from Guidewire Configuration in an easy manner. This includes Policy Center and Billing Center **appconfig.xml**, **plugin.xml** and **config.xml** files. Sourcerer offers the ability to compare files from different branches.

This application also sources information from config.ini (External Configurations). It has the ability to perform CRUD operations on these items, but is not currently in use.

<!-- BUILT WITH -->

### Built With

This app is front-end heavy and is built primarily with Vue.js 2 (JS Framework). Most of the styling was done through bootstrap or custom styles. The backend was built with Node.js + Express.

Front end:

-  [Vue.js 2](https://vuejs.org/)
-  [Vuex](https://vuex.vuejs.org/guide/)
-  [Bootstrap](https://getbootstrap.com)
-  [JQuery](https://jquery.com)
-  [Axios](https://www.npmjs.com/package/axios)

Back end:

-  [Node.js](https://nodejs.org/en/)
-  [Express.js](https://expressjs.com/)

Primary Utilities:

-  [Python](https://www.python.org/)
-  [PyMongo](https://pymongo.readthedocs.io/en/stable/index.html)
-  [MongoDB](https://www.mongodb.com/)
-  [SwaggerUI](https://swagger.io/tools/swagger-ui/)

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

-  **node** (version 7.6 or higher)
-  **npm**

### Installation

1. Clone the repo

```sh
git clone https://bitbucket.cooperators.ca/scm/csid/sourcerer.git
```

2. Go into the `server` folder:

```sh
cd sourcerer-server
```

3. Install NPM packages:

```
npm install
```

4. Start server with:

```
npm run dev
```

5. If all is succesful you should see:

```
Server started on port 8615
Connected to MongoDb
```

6. Visit <a href="http://localhost:8615/">running site</a> to see the server's compilation of the project.

7. Now that the backend is running, let's setup the front end (this should take a minute):

```
cd ../sourcerer-client
npm install
```

8. Run the front end local-server (this is done through vue-cli and it hot reloads.. AMAZIN!)

```
npm run serve
```

9. If all is succesful setting up the front-end you should see

```
  App running at:
  - Local:   http://localhost:8080/
  - Network: http://localhost:8080/
```

10. Visit <a href="http://localhost:8080/ ">To see the development site</a>
11. Once adequate changes are made to the front-end, run:

```
npm run build
```

This transpiles all the Vue code written into Javascript, and webpack minifies everything so the backend can simply send back a public folder with a few .js/css/html files, and a browser can handle everything with ease.

<!-- ROADMAP -->

## How it works

<a href="https://docs.google.com/presentation/d/1Ighd6HxBZTOusoQ2y3v-dqcF4fCAOSchdjNoe0oW0s8/edit#slide=id.p">Small slide show to demonstrate the flow of data.</a>
