const inferredRegexPatterns = [
  {
    keyword: "email",
    pattern: /^[\w.-]+@[\w.-]+\.\w{2,4}$/,
    message: "Invalid email address",
  },
  {
    keyword: "phone",
    pattern: /^[6-9]\d{9}$/,
    message: "Invalid phone number",
  },
  {
    keyword: "url",
    pattern: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
    message: "Invalid URL",
  },
  {
    keyword: "name",
    pattern: /^[a-zA-Z ]{2,30}$/,
    message: "Invalid name format",
  },
  {
    keyword: "username",
    pattern: /^[a-zA-Z0-9_]{3,20}$/,
    message: "Invalid username format",
  },
];

export default inferredRegexPatterns;