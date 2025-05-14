import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getAllUser = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const filterUser = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );

    return res.status(200).json({
      success: true,
      data: filterUser,
      message: "All users fetched successfully",
    });
  } catch (error) {
    console.log("Error in getAllUser controller", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        {
          sender: myId,
          receiver: userToChatId,
        },
        {
          sender: userToChatId,
          receiver: myId,
        },
      ],
    });

    return res.status(200).json({
      success: true,
      data: messages,
      message: "Messages fetched successfully",
    });
  } catch (error) {
    console.log("Error in getMessages controller", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id:receiverId} = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();
        // todo: realtime functionality goes here -> socket.io
        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        })
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
}