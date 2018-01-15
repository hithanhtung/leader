const path = require('path');
const fs = require('fs');
const jsCompressor = require('node-minify');
const sass = require('node-sass');

const srcPath = 'src/';
const modelPath = srcPath + 'model/';
const modulePath = srcPath + 'module/';
const viewPath = srcPath + 'view/';
const javascriptMainPath = viewPath + 'js/';
const sassMainPath = viewPath + 'sass/';

const publicPath = 'public/';
const publicImgPath = publicPath + 'img/';
const publicModuleName = 'md';
const publicJsPath = publicPath + 'js/';
const publicCssPath = publicPath + 'css/';
const publicJsModulePath = publicJsPath + publicModuleName + '/';
const publicCssModulePath = publicCssPath + publicModuleName + '/';

// Create directories -----------------------------------------------------------------------------
if (!fs.existsSync(srcPath)) fs.mkdir(srcPath);
if (!fs.existsSync(modelPath)) fs.mkdir(modelPath);
if (!fs.existsSync(modulePath)) fs.mkdir(modulePath);
if (!fs.existsSync(viewPath)) fs.mkdir(viewPath);
if (!fs.existsSync(javascriptMainPath)) fs.mkdir(javascriptMainPath);
if (!fs.existsSync(sassMainPath)) fs.mkdir(sassMainPath);
if (!fs.existsSync(publicPath)) fs.mkdir(publicPath);
if (!fs.existsSync(publicImgPath)) fs.mkdir(publicImgPath);
if (!fs.existsSync(publicJsPath)) fs.mkdir(publicJsPath);
if (!fs.existsSync(publicJsModulePath)) fs.mkdir(publicJsModulePath);
if (!fs.existsSync(publicCssPath)) fs.mkdir(publicCssPath);
if (!fs.existsSync(publicCssModulePath)) fs.mkdir(publicCssModulePath);

// Compress --------------------------------------------------------------------------------------{
var compressJavascript = (sourcePath, binPath, publicPath) => {
    jsCompressor.minify({
        compressor: 'uglifyjs',
        input: sourcePath,
        output: binPath,
        callback: function (error, min) {
            if (error) {
                console.log(error);
            } else {
                fs.createReadStream(binPath).pipe(fs.createWriteStream(publicPath));
            }
        }
    });
};

var combineSass = (sourcePath, binPath, publicPath) => {
    sass.render({
        file: sourcePath,
        outputStyle: 'compressed'
    }, function (error, result) {
        if (error) {
            console.log(error);
        } else {
            fs.writeFile(binPath, result.css);
            fs.writeFile(publicPath, result.css);
        }
    });
};

// Watch -----------------------------------------------------------------------------------------{
fs.watch(javascriptMainPath, (eventType, filename) => {
    var sourcePath = javascriptMainPath + filename;
    if (filename.endsWith('.js') && fs.existsSync(sourcePath)) {
        var minFilename = filename.replace('.js', '.min.js');
        compressJavascript(sourcePath, javascriptMainPath + 'bin/' + minFilename, publicPath + 'js/' + minFilename);
        console.log('Compress:', sourcePath);
    }
});

fs.watch(sassMainPath, (eventType, filename) => {
    var sourcePath = sassMainPath + filename;
    if (filename.endsWith('.scss') && fs.existsSync(sourcePath)) {
        var minFilename = filename.replace('.scss', '.min.css');
        combineSass(sourcePath, sassMainPath + 'bin/' + minFilename, publicPath + 'css/' + minFilename);
        console.log('Compress:', sourcePath);
    }
});

var watchModule = (moduleName) => {
    var viewPath = modulePath + moduleName + '/view/';
    if (!fs.existsSync(viewPath)) fs.mkdir(viewPath);

    fs.watch(viewPath, (eventType, filename) => {
        var sourcePath = viewPath + filename;
        if (fs.existsSync(sourcePath)) {
            if (filename.endsWith('.js')) {
                var minFilename = filename.replace('.js', '.min.js');
                compressJavascript(sourcePath, viewPath + 'bin/' + minFilename, publicJsModulePath + moduleName + '.min.js');
                console.log('Compress:', sourcePath);
            } else if (filename.endsWith('.scss')) {
                var minFilename = filename.replace('.scss', '.min.css');
                combineSass(sourcePath, viewPath + 'bin/' + minFilename, publicCssModulePath + moduleName + '.min.css');
                console.log('Compress:', sourcePath);
            }
        }
    });
};
fs.readdirSync(modulePath).forEach((moduleName) => {
    watchModule(moduleName);
});
fs.watch(modulePath, (eventType, moduleName) => {
    if (fs.existsSync(modulePath + moduleName) && fs.lstatSync(modulePath + moduleName).isDirectory()) {
        var viewPath = path.join(modulePath, moduleName, 'view'),
            viewBinPath = path.join(viewPath, 'bin'),
            viewJsPath = path.join(viewPath, 'frontend.js'),
            viewScssPath = path.join(viewPath, 'frontend.scss'),
            viewPugPath = path.join(viewPath, 'index.pug'),
            modelPath = path.join(modulePath, moduleName, 'model.js'),
            controllerPath = path.join(modulePath, moduleName, 'controller.js');

        if (!fs.existsSync(viewPath)) fs.mkdirSync(viewPath);
        if (!fs.existsSync(viewBinPath)) fs.mkdirSync(viewBinPath);
        if (!fs.existsSync(viewJsPath)) fs.writeFile(viewJsPath, '');
        if (!fs.existsSync(viewScssPath)) fs.writeFile(viewScssPath, '');
        if (!fs.existsSync(viewPugPath)) fs.writeFile(viewPugPath, 'extends ../../../view/main\n');
        //if (!fs.existsSync(modelPath)) fs.writeFile(modelPath, 'module.exports = (app) => {\n\n};');
        if (!fs.existsSync(controllerPath)) fs.writeFile(controllerPath, 'module.exports = (app, moduleViewPath) => {\n\n};');

        watchModule(moduleName);
        console.log('Watch new module', moduleName);
    }
});
