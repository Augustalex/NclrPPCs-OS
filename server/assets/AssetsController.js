const path = require('path');

module.exports = function () {

    return {
        getImage,
        getSound
    };

    function getImage(req, res) {
        const imageName = req.params.imageName;
        const filePath = path.join(__dirname, 'images', imageName);
        res.sendFile(filePath);
    }

    function getSound(req, res) {
        const soundName = req.params.soundName;
        const filePath = path.join(__dirname, 'sound', soundName);
        res.sendFile(filePath);
    }
};