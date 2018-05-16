'use strict';
// configFilePath should be a string with a path to a client_secret.json. This folder needs to be writable in order to have a token saved/managed
    // process.env.PATH_TO_CLIENT_SECRET_JSON is expected to have a valid path to a OAuth/Other/client_secret.json
    //  as provided by the steps at https://console.cloud.google.com/apis/credentials. A detailed tutorial can be
    //  found in Step 1 at https://developers.google.com/drive/v3/web/quickstart/nodejs.

module.exports = function(configFilePath) {

    const README = '\n\nThis script is intended to help you use a google API  \
client_secret.json file to obtain an OAUTH token (json data) and \
store it next to the source .json for future use. \n\n\
To acomplish this, you will be given an URL that you can follow to  \
get a "code" which can then be used to get a token. As an I/O solution \
I run this script with `node --inspect-brk` and then I catch the debugger \
after the URL is logged to the console. Once I have the code, I can run \
`code="{codeFromUrl}"` and resume the script. \n\n\n';

    const path = require('path'),
        fs = require('fs'),
        keyfile = path.normalize(configFilePath) ? path.normalize(configFilePath) : (process.env.PATH_TO_CLIENT_SECRET_JSON && process.env.PATH_TO_CLIENT_SECRET_JSON.length > 1 ? path.normalize(process.env.PATH_TO_CLIENT_SECRET_JSON) : null),
        tokenfile = keyfile.replace(/\.json$/g, '') + '.token',
        keys = JSON.parse(fs.readFileSync(keyfile)),
        scopes = ['https://www.googleapis.com/auth/drive'],
        {google} = require('googleapis');

        if ( process.env.NODE_ENV=='dev' ) console.log( 'Trying with keyfile: ', keyfile );

    if (keyfile.length > 1) {

        return new Promise((resolve, reject) => {

            let client = new google.auth.OAuth2(
                    keys.web.client_id,
                    keys.web.client_secret,
                    keys.web.redirect_uris[0]
                ),
                code = null;

            if (fs.existsSync(tokenfile)) {
                let token = JSON.parse(fs.readFileSync(tokenfile));
                if (token.refresh_token && token.access_token) {
                    client.credentials = token;
                    if ( process.env.NODE_ENV=='dev' ) console.log('Loaded existing tokenfile: ' + tokenfile);
                }
            }

            if (  client.credentials && ( client.credentials.access_token || client.credentials.refresh_token ) ) {
                resolve(client);
            } else {
                if ( process.env.NODE_ENV=='dev' ) console.log(README);
                //Start with node --inspect-brk so you have time to hit this then retrieve the code and `code='{yournewcode}'` in the console
                console.log('\nGet code from:\n\n' + client.generateAuthUrl({ access_type: 'offline', scope: scopes }));
                console.log('\nWhen you have that code, return and run `code="yourNewCode"` in the console and resume the debugger.\n\n');
                debugger;

                client.getTokenAsync({ code: code })
                    .then(res => {
                        if (res.tokens) {
                            let tokens = res.tokens;
                            fs.writeFile(tokenfile, JSON.stringify(tokens), err => {
                                if (err) {
                                    console.error('Error writing token file.');
                                    console.dir(err);
                                }
                                if ( process.env.NODE_ENV=='dev' ) console.log("Token file written to:" + tokenfile);
                                client.credentials = tokens;
                                resolve(client);
                            });
                        } else {
                            console.error('Error getting oAuth tokens. See res object for more details');
                            console.dir(res);
                        }
                    })
                    .catch(err => {
                        console.error('Error getting oAuth tokens');
                        console.dir(err);
                    });

            }

        });

    } else {
        throw error('configFilePath not provided');
    }

}