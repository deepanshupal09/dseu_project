import * as otpGenerator from "otp-generator";

const generateOTP = (): string => {
  const OTP: string = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false
  });
  return OTP;
};

export default generateOTP;
