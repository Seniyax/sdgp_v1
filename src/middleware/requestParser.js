const express = require('express');

const requestParser = {
    json: express.json(),
    urlencoded: express.urlencoded({ extended: true })
};
module.exports = requestParser;
