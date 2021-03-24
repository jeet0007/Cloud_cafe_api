require('dotenv/config');
const jwtSecret = require("../../config/jwtConfig");
const bcrypt = require("bcrypt");

const BCRYPT_SALT_ROUNDS = 10;

const passport = require("passport")
