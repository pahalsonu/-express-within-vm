const fs = require('fs');
const path = require('path');

const pathname = path.join(__dirname, './iprecord');

const data = {};

data.append = (file,data, callback) =>{
    fs.appendFile(pathname+"/"+file, data, (err) =>{
        if (!err) {
            callback(false);
        } else {
            callback("Error in appending a File!");
        }
    })
}

module.exports = data;