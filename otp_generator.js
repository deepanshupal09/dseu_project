"use strict";
exports.__esModule = true;
var otpGenerator = require("otp-generator");
var generateOTP = function () {
    var OTP = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
    return OTP;
};
exports["default"] = generateOTP;
