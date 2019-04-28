# Taxonomy ReactJS

A web application to help young students learn about biology, in particular the taxonomy of animals. The frontend is done in ReactJS, the backend in Node, particularly using Express, as well as SQLite3 for the database.

## Functionality
Once the page loads, the data table displays a list of animals in rows with accompanying taxonomic information, habitat, and conservation status using the IUCN Red List classification ([see Wikipedia](https://en.wikipedia.org/wiki/IUCN_Red_List) for more info.)

The user can then sort the animals by any of the columns displayed and also have an input field in each column that they can use to filter out the animals they want to see. Multiple filters can be used at once.

Finally, a csv file can be generated that contains the entire table for offline viewing.

## Requirements
If you are building ReactJS with a script or otherwise automatically, nearly all the required packages should be included on setup. See the package json file that is included for details and version information. In particular, the following modules are used:

* Express
* Body-Parser
* CORS
* Babel
* CSS-Loader, Style-Loader
* Webpack
* React
* SQLite3
* OS
* React-Hot-Loader

Newer implementations than the ones listed in the package.json file should be fine, but I cannot guarantee that.

## Deployment
You would need a sqlite3 database running that matches the name and schema given in the server file. This has not been included.

Unzip the files, launch a terminal, and call `npm run server` to launch the JavaScript server and API controller. Then call `npm run client` to launch the ReactJS frontend. It uses a proxy connection to contact the running server on another port.

For the moment, the server and client must be run separately. In the future, a proper production build may be added that will merge the two into a single command.

## Author
a sample ReactJS one-page application by ajexplar

## TODO

Some ideas for the future:
* A button to immediately clear all filters
* Adding and Deleting values from the table
* Bootstrap or another similar library
* A proper production build
