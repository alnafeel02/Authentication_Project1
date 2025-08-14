import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
     const { userId } = req;
     const user = await userModel.findById(userId);
        if (!user) {
        return res.json({ success: false, message: "User not found" });
        }

         return res.status(200).json({ success: true, userData:{
            name: user.name,
            isAccountverified: user.isAccountverified,
         }});
  } catch (error) {
    console.error("Error fetching user details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}