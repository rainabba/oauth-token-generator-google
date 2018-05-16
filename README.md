### oauth-token-generator-google

After many battles with nodejs server authentication against Google APIs
(Drive in particular), I've come up with an NPM module that needs only a well
configured client_secrets.json and it will save the token locally and try to
reuse it when it's there. After retrieving a token, a full oauth client is
returned with that token in place. That client can be used for googleapi
calls configured for the client_id in the client_secret.json

My reasons for doing this may be inferred from https://github.com/google/google-api-nodejs-client/issues/266#issuecomment-368151072

This script is intended to help you use a google API client_secret.json file
to obtain an OAUTH token (json data) and store it next to the source .json
for future use.

To acomplish this, you will be given an URL that you can follow to
get a "code" which can then be used to get a token. As an I/O solution
I run this script with `node --inspect-brk` and then I catch the debugger
after the URL is logged to the console. Once I have the code, I can run
`code="{codeFromUrl}"` and resume the script.

See test/index.js for a full example of how to use this library and
retrieve a list of files in root of Drive for the configured credentials.

The default test assumes you have created a private/client_secret.json in
the project folder. The private/ folder is in .gitignore and that path is
fully configurable as the only thing provided when executing the module.

`npm test` to run basic tests.
`npm run test:dev` to test with debugging (to troubleshoot your file path, contents, etc.. until you get things working as expected with this plugin)
