<template>
  <div id="ReadMe" class="p-4">
   <!-- TABLE OF CONTENTS -->
   <h2 id="table-of-contents">Table of Contents</h2>
   <ul>
      <li><a href="#about-the-project">About the Project</a>
         <ul>
            <li><a href="#built-with">Built With</a></li>
         </ul>
      </li>
      <li><a href="#getting-started">Getting Started</a>
         <ul>
            <li><a href="#prerequisites">Prerequisites</a></li>
            <li><a href="#installation">Installation</a></li>
         </ul>
      </li>
      <li><a href="#how-it-works">How It Works</a></li>
   </ul>
   <!-- ABOUT THE PROJECT -->
   <h2 id="about-the-project">About The Project</h2>
   <p>Sourcerer is a web application that is designed primarily for viewing information from Guidewire Configuration in
      an easy manner. This includes Policy Center and Billing Center <strong>appconfig.xml</strong>,
      <strong>plugin.xml</strong> and <strong>config.xml</strong> files. Sourcerer offers the ability to compare files
      from different branches.</p>
   <p>This application also sources information from config.ini (External Configurations). It has the ability to perform
      CRUD operations on these items, but is not currently in use.</p>
   <!-- BUILT WITH -->
   <h3 id="built-with">Built With</h3>
   <p>This app is front-end heavy and is built primarily with Vue.js 2 (JS Framework). Most of the styling was done
      through bootstrap or custom styles. The backend was built with Node.js + Express.</p>
   <p>Front end:</p>
   <ul>
      <li><a href="https://vuejs.org/">Vue.js 2</a></li>
      <li><a href="https://vuex.vuejs.org/guide/">Vuex</a></li>
      <li><a href="https://getbootstrap.com">Bootstrap</a></li>
      <li><a href="https://jquery.com">JQuery</a></li>
      <li><a href="https://www.npmjs.com/package/axios">Axios</a></li>
   </ul>
   <p>Back end:</p>
   <ul>
      <li><a href="https://nodejs.org/en/">Node.js</a></li>
      <li><a href="https://expressjs.com/">Express.js</a></li>
   </ul>
   <p>Primary Utilities:</p>
   <ul>
      <li><a href="https://www.python.org/">Python</a></li>
      <li><a href="https://pymongo.readthedocs.io/en/stable/index.html">PyMongo</a></li>
      <li><a href="https://www.mongodb.com/">MongoDB</a></li>
      <li><a href="https://swagger.io/tools/swagger-ui/">SwaggerUI</a></li>
   </ul>
   <!-- GETTING STARTED -->
   <h2 id="getting-started">Getting Started</h2>
   <p>This is an example of how you may give instructions on setting up your project locally.
      To get a local copy up and running follow these simple example steps.</p>
   <h3 id="prerequisites">Prerequisites</h3>
   <ul>
      <li><strong>node</strong> (version 7.6 or higher)</li>
      <li><strong>npm</strong></li>
   </ul>
   <h3 id="installation">Installation</h3>
   <ol>
      <li>Clone the repo</li>
   </ol>
   <pre><code class="lang-sh">git <span class="hljs-keyword">clone</span> <span class="hljs-title">https</span>://bitbucket.cooperators.ca/scm/csid/sourcerer.git
</code></pre>
   <ol>
      <li>Go into the <code>server</code> folder:</li>
   </ol>
   <pre><code class="lang-sh">cd <span class="hljs-keyword">sourcerer-server</span>
</code></pre>
   <ol>
      <li>Install NPM packages:</li>
   </ol>
   <pre><code>npm <span class="hljs-keyword">install</span>
</code></pre>
   <ol>
      <li>Start server with:</li>
   </ol>
   <pre><code>npm <span class="hljs-keyword">run</span><span class="bash"> dev</span>
</code></pre>
   <ol>
      <li>If all is succesful you should see:</li>
   </ol>
   <pre><code>Server started <span class="hljs-keyword">on</span> port <span class="hljs-number">8615</span>
Connected <span class="hljs-keyword">to</span> MongoDb
</code></pre>
   <ol>
      <li>
         <p>Visit <a href="http://localhost:8615/">running site</a> to see the server&#39;s compilation of the project.
         </p>
      </li>
      <li>
         <p>Now that the backend is running, let&#39;s setup the front end (this should take a minute):</p>
      </li>
   </ol>
   <pre><code><span class="hljs-function"><span class="hljs-title">cd</span></span> ../sourcerer-client
npm install
</code></pre>
   <ol>
      <li>Run the front end local-server (this is done through vue-cli and it hot reloads.. AMAZIN!)</li>
   </ol>
   <pre><code>npm <span class="hljs-keyword">run</span><span class="bash"> serve</span>
</code></pre>
   <ol>
      <li>If all is succesful setting up the front-end you should see</li>
   </ol>
   <pre><code>  App running <span class="hljs-string">at:</span>
  - <span class="hljs-string">Local:</span>   <span class="hljs-string">http:</span><span class="hljs-comment">//localhost:8080/</span>
  - <span class="hljs-string">Network:</span> <span class="hljs-string">http:</span><span class="hljs-comment">//localhost:8080/</span>
</code></pre>
   <ol>
      <li>Visit <a href="http://localhost:8080/ ">To see the development site</a></li>
      <li>Once adequate changes are made to the front-end, run:</li>
   </ol>
   <pre><code>npm <span class="hljs-keyword">run</span><span class="bash"> build</span>
</code></pre>
   <p>This compiles all the Vue code written into Javascript, and webpack minifies everything so the backend can
      simply send back a public folder with a few .js/css/html files, and a browser can handle everything with ease.</p>
   <!-- HOW IT WORKS -->
   <h2 id="how-it-works">How it works</h2>
   <p><a href="https://docs.google.com/presentation/d/1Ighd6HxBZTOusoQ2y3v-dqcF4fCAOSchdjNoe0oW0s8/edit#slide=id.p">Small
         slide show to demonstrate the flow of data.</a></p>
  </div>
</template>

<script>
export default {

}
</script>

<style>

code{
  background-color: #F4F5F7;
  border-radius: 5px;
  border: 1px solid rgb(223, 225, 230);
}

</style>