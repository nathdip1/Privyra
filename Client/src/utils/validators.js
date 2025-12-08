// src/utils/validators.js

// Username: only alphanumeric/alphabetic
export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9]+$/;
  // TODO: check uniqueness against your backend
  return regex.test(username) && username.length > 0;
};

// Password: 8–12 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
export const validatePassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,12}$/;
  return regex.test(password);
};
