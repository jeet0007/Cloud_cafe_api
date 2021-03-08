import * as queryString from 'query-string';
require('dotenv/config');

const stringifiedParams = queryString.stringify({
    client_id: process.env.CLIENT_ID,
    redirect_uri: 'https://www.example.com/authenticate/google',
    scope: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

exports = googleLoginUrl;