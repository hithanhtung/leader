var express = require('express');
var app = express();
var http = require('http').Server(app);

// Variables ==================================================================
app.title = 'Student Leader';
app.version = '1.0.1';
app.isDebug = true;
app.mongodb = 'mongodb://localhost/student_leader';
app.path = require('path');
app.mailFrom = 'info@iuoss.com';
app.mailPassword = 'osa@2013';
app.mailCc = [];
app.viewPath = app.path.join(__dirname, 'src/view') + '/';
app.modelPath = app.path.join(__dirname, 'src/model') + '/';
app.modulePath = app.path.join(__dirname, 'src/module') + '/';
app.publicPath = app.path.join(__dirname, 'public');
app.faviconPath = app.path.join(__dirname, 'public/favicon.ico');

// Configure ==================================================================
require('./src/config/common')(app);
require('./src/config/packages')(app);
require('./src/config/database')(app);
// require('./src/config/authentication')(app);
require('./src/config/view')(app, express);
// require('./src/config/schedule')(app);
require('./src/config/io')(app, http);
//require('./src/config/error')(app);

// Load project's components ==================================================
app.loadModels();
app.loadModules();

// Launch website =============================================================
var port = process.env.PORT || 8000;
http.listen(port, () => {
    console.log('The magic happens on http://localhost:%d.', port);
});