import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// --- BOT INTEGRATION: Import and Configure Google Gemini AI ---
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

// IMPORTANT: Make sure this ID is the correct string from your MongoDB user for the bot
const botUserId = "68d4e02bb4cbb07f7d562b20"; // Example ID, replace with your actual one

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // 1. Find the AI Bot user specifically
    const botUser = await User.findById(botUserId).select("-password");

    // 2. Find all other users, excluding both the logged-in user and the bot
    const otherUsers = await User.find({
      _id: { $nin: [loggedInUserId, botUserId] },
    }).select("-password");

    // 3. Combine the lists, placing the bot at the top
    // The .filter(Boolean) gracefully handles the case where the bot might not be found
    const sortedUsers = [botUser, ...otherUsers].filter(Boolean);

    res.status(200).json(sortedUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    if (String(receiverId) === botUserId && text) {
      const prompt = text.trim();
      const result = await model.generateContent(prompt);
      const botText = result.response.text();

      const botMessage = new Message({
        senderId: botUserId,
        receiverId: senderId,
        text: botText,
      });

      await botMessage.save();

      const senderSocketId = getReceiverSocketId(String(senderId));
      if (senderSocketId) {
        io.to(senderSocketId).emit("newMessage", botMessage);
      }
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("FULL ERROR in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
