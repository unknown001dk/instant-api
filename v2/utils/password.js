import argon2 from "argon2";

export const hashedPassword = async (password) => {
  try {
    console.log(password)
    const hash = await argon2.hash(password);
    console.log("Hashed password:", hash);
    return hash;
  } catch (err) {
    console.error("Error hashing password:", err);
  }
};

export const verifyPassword =  async(hash, password) => {
  try {
    const isMatch = await argon2.verify(hash, password);
    return isMatch;
  } catch (err) {
    console.error("Error verifying password:", err);
  }
}
