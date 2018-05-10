const path = require('path'),
    fs = require('fs'),
    { google } = require('googleapis');

let googleAuthCredentials = path.join(__dirname, '../private/client_secret.json'),
    Code = require('code'),
    Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.describe,
    it = lab.it,
    before = lab.before,
    after = lab.after,
    expect = Code.expect;

lab.experiment("Google API ", { timeout: 35000 }, () => {

    lab.test("Drive ListFiles", () => {

        return new Promise((resolve, reject) => {
            require('../lib/')(googleAuthCredentials)
                .then(auth => {
                    const service = google.drive('v3');
                    service.files.list({
                        auth: auth,
                        pageSize: 10,
                        fields: 'nextPageToken, files(id, name)'
                    }, (err, res) => {
                        if (err) {
                            console.error('The API returned an error.');
                            console.dir( err );
                            reject(err);
                        }
                        expect(res.data.files).to.be.an.array();
                        expect(res.data.files.length).to.be.greaterThan(0);
                        resolve();
                    });
                })
                .catch(error => {
                    console.log("Error retrieving google token");
                    console.dir(error);
                    reject(error);
                })
        });
        //expect(true).to.be.true;
    });

});