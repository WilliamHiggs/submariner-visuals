
/*
* A static server to serve all the public files
* it's simple, made to just work on stage.
*/

const express = require('express');
const serveStatic = require('serve-static');
const path = require('path');
const app = express();
const port = 3000;

app.use(serveStatic(path.join(__dirname, 'public')));

app.listen(port);
