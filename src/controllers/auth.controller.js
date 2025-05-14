import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import env from "dotenv";

env.config();

// signup
export const signup = async (req, res) => {
  try {
    const { email, fullName, password, profilePicture } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Oops! User already exists, Please Login",
      });
    }

    // secure password
    // hashing password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error while hashing the password",
      });
    }

    // If user does not exist, create a new user
    const user = await User.create({
      email,
      fullName,
      password: hashedPassword,
      profilePicture,
    });

    return res.status(200).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    return res.status(500).json({
      success: false,
      message: "Error while creating new user",
    });
  }
};

// login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill of fields",
      });
    }

    // checking is user present with the email or not

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Oops! User is not register with this email, Please Signup first",
      });
    }

    const payload = {
      user: user.email,
      id: user._id,
    };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        //Options
        {
          expiresIn: "24h",
        }
      );

      // convert mongoose model to a plain javascript object
      user = user.toObject();
      user.token = token;
      user.password = undefined;

      // console.log(user);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpsOnly: true,
        secure: true,
        sameSite: "Strict",
      };

      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "User loggedIn Successfully",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log("Error while login", error);
    return res.status(500).json({
      success: false,
      message: "Error while Login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: "User Logged Out successfully",
    });
  } catch (error) {
    console.log("Error while logging out", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// update user profile
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;
    if (!profilePic) {
      return res.status(400).json({
        success: false,
        message: "Please provide a profile picture",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log("Error while updating profile", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User is authenticated",
      user: req.user,
    });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
