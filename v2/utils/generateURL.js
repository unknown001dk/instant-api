import User from "../models/user.model.js"

export const generateURL = async(userId) => {
  const finduser = await User.findById(userId);
  console.log(finduser);
}