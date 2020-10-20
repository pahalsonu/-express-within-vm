const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const datalogic = require('./datalogic');
const https = require('https');
const http = require('http');

const pathname = path.join(__dirname, './iprecord');

const httpPort = process.env.port || 8000;
const httpsPort = process.env.port || 4430;
// const SSLData = {
//     key : fs.readFileSync('./.config/private.key'),
//     cert : fs.readFileSync('./.config/certificate.crt')
// }
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(SSLData, app);

app.use((req, res, next) => {

    //below is the 5 variables required to create file name and append data in file
    const date = new Date();
    const currentTimeStampFileName = date.getTime()
    const currentTimeStamp = date.toLocaleString();
    const ip = req.ip;
    const data = " your server is running at following ip -: " + ip + " " + "at" + " " + currentTimeStamp + "\n";
    // read all files iprecord folder
    fs.readdir(pathname, (err, files) => {

        if (files[0]) {
            const totalFiles = files.length;
            const currentFile = files[totalFiles - 1];
            // if file or more than one file is present select current file from above logic

            fs.stat(pathname + "/" + currentFile, (err, stats) => {
                if (!err) {
                    
                    // check if file size greater than 2MB
                    if (stats.size < 2000) {
                        // file size is less than 2 MB append in current file
                        datalogic.append(currentFile, data, (err) => {
                            if (!err) {
                                console.log("Data is appended in current file")
                            } else {
                                console.log("Data is not appended in  current file")
                            }
                        });

                    } else {
                        // file size is greater than 2 MB create new file and add data
                        datalogic.append(currentTimeStampFileName, data, (err) => {
                            if (!err) {
                                console.log("Data is appended in New file")
                            } else {
                                console.log("Data is not appended in  New file")
                            }
                        });
                    }
                } else {
                    console.log("File can not be read")
                }
            });
        } else {
            // there is no file creating file for first time
            datalogic.append(currentTimeStampFileName, data, (err) => {
                if (!err) {
                    console.log("New First file is created")
                } else {
                    console.log("Err in creating New file")
                }

            })
        }

    })
    res.send('IP address Logger file')
})


httpServer.listen(httpPort, () => {
    console.log(`App Started at http://localhost:${httpPort}`);
});
// httpsServer.listen(httpsPort, () => {
//     console.log(`App Started at https://localhost:${httpsPort}`);
// })