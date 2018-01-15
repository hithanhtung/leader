module.exports = (app) => {

    // Create barcode
    app.bwipjs = require('bwip-js');
    app.createBarcode = (code, done) => {
        app.bwipjs.toBuffer({
            bcid: 'qrcode',
            text: code.toString(),
            scale: 3,
            width: 30,
            height: 30,
            includetext: true,
            textxalign: 'center',
            textfont: 'Inconsolata',
            textsize: 10
        }, (err, pngBuffer) => {
            if (err && done) done(null);
            app.jimp.read(pngBuffer, (err, pngQrCode) => {
                app.bwipjs.toBuffer({
                    bcid: 'code128',
                    text: code.toString(),
                    scale: 3,
                    width: 30,
                    height: 30,
                    includetext: true,
                    textxalign: 'center',
                    textfont: 'Inconsolata',
                    textsize: 10
                }, (err, pngBuffer) => {
                    if (err && done) done(null);
                    app.jimp.read(pngBuffer, (err, pngBarCode) => {
                        if (err && done) done(null);
                        if (done) done(pngQrCode, pngBarCode);
                    });
                });
            });
        });
    };
};