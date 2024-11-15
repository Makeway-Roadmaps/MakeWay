const { parsePhoneNumberFromString } = require("libphonenumber-js");

/**
 * Validates and formats a phone number with country code.
 * @param {string} phoneNumberString - The phone number with country code (e.g., +911234567890).
 * @returns {object} - The formatted phone number details or an error.
 */
const validatePhoneNumber = (phoneNumberString) => {
  const phoneNumber = parsePhoneNumberFromString(phoneNumberString);
  
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error("Invalid phone number");
  }

  return {
    country: phoneNumber.country, // e.g., IN
    countryCode: phoneNumber.countryCallingCode, // e.g., 91
    formatted: phoneNumber.formatInternational(), // e.g., +91 12345 67890
    e164: phoneNumber.format("E.164"), // e.g., +911234567890
    national: phoneNumber.formatNational(), // e.g., 12345 67890
  };
};
