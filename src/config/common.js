module.exports = (app) => {

    // Generate default options in order to render view
    app.defaultOptions = (req) => {
        return {
            title: app.title,
            isDebug: app.isDebug,
            version: app.version,
            user: req.session.user,
            token: req.sessionID,
            timestamp: Date.now() + 6 * 60 * 60 * 1000
        };
    };

    // Load models
    app.loadModels = () => {
        const fs = require('fs');
        var list = fs.readdirSync(app.modelPath);
        list.forEach((modelName) => {
            var modelPath = app.path.join(app.modelPath, modelName);

            if (fs.existsSync(modelPath) && fs.statSync(modelPath).isFile()) {
                app.debug('Init: load model => ' + modelName);
                require(modelPath)(app);
            }
        });
    };

    // Load all modules
    app.loadModules = () => {
        const fs = require('fs');
        var list = fs.readdirSync(app.modulePath);
        list.forEach((moduleName) => {
            var modulePath = app.path.join(app.modulePath, moduleName),
                modelPath = app.path.join(modulePath, 'model.js'),
                controllerPath = app.path.join(modulePath, 'controller.js');

            if (moduleName != '.' && fs.statSync(modulePath).isDirectory()) {
                app.debug('The ' + moduleName + ' module initialization succeeded.');

                if (fs.existsSync(modelPath) && fs.statSync(modelPath).isFile()) {
                    require(modelPath)(app);
                }

                if (fs.existsSync(controllerPath) && fs.statSync(controllerPath).isFile()) {
                    require(controllerPath)(app, '../module/' + moduleName + '/view/');
                }
            }
        });
    };

    // Download file (http / https)
    app.downloadFile = (url, path) => {
        var network = require(url.startsWith('http') ? 'http' : 'https');
        var file = require('fs').createWriteStream(path);
        network.get(url, (response) => {
            response.pipe(file);
        });
    };

    // Send message when debug is true
    app.debug = (message) => {
        if (app.isDebug) console.log(message);
    };
};