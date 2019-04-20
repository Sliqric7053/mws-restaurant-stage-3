## Getting Started

### Development local API Server
_Location of server = /server_
Server depends on [node.js LTS Version: v6.11.2 ](https://nodejs.org/en/download/), [npm](https://www.npmjs.com/get-npm), and [sails.js](http://sailsjs.com/)

Please make sure you have these installed before proceeding forward.

###### Install project dependancies
```Install project dependancies
# npm i
```
###### Install Sails.js globally
```Install sails global
# npm i sails -g
```
###### Start the server
```Start server
# node server
```
### You should now have access to your API server environment
debug: Environment : development
debug: Port        : 1337

### To Run The App
```
https://sliqric7053.github.io/mws-restaurant-stage-3
```
#### For Python2:


At the root folder, use python -m SimpleHTTPServer 8080 at the command line.
Then type localhost:8080 into your browser

#### For Python3:
At the root folder, use python3 -m http.server 8080 at the command line.
Then type localhost:8080 into your browser

Open a separate command line and type 'node server' to luanch sails as stated earlier.
```
=======================================================================================
=======================================================================================
======================== SPECIFICATIONS ===============================================
=======================================================================================
=======================================================================================

### Restaurant Reviews: Stage 3

# Functionality

CRITERIA | MEETS SPECIFICATIONS:

User Interface

Users are able to mark a restaurant as a favorite, this toggle is visible in the application. A form is added to allow users to add their own reviews for a restaurant. Form submission works properly and adds a new review to the database.

Offline Use

The client application works offline. JSON responses are cached using the IndexedDB API. Any data previously accessed while connected is reachable while offline. User is able to add a review to a restaurant while offline and the review is sent to the server when connectivity is re-established.

# Responsive Design and Accessibility

CRITERIA | MEETS SPECIFICATIONS:

Responsive Design

The application maintains a responsive design on mobile, tablet and desktop viewports. All new features are responsive, including the form to add a review and the control for marking a restaurant as a favorite.

Accessibility

The application retains accessibility features from the previous projects. Images have alternate text, the application uses appropriate focus management for navigation, and semantic elements and ARIA attributes are used correctly. Roles are correctly defined for all elements of the review form.

# Performance

CRITERIA | MEETS SPECIFICATIONS:
Site Performance

Lighthouse targets for each category exceed:

Progressive Web App: >90
Performance: >90
Accessibility: >90
