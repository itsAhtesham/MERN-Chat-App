import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const cookieOptions = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: true,
    httpOnly: true,
    sameSite: "none"
}

const connectDB = (uri) => {
    console.log("DB Con");

    mongoose.connect(uri, {
        dbName: 'Chattu'
    }).then((data) => {
        console.log(`Connected to DB: ${data.connection.host}`);
    }).catch((e) => { throw e })
}

const sendToken = (res, user, code, message) => {
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    res.status(code).cookie("chattu-token", token, { options: cookieOptions }).json({
        success: true,
        token,
        message
    })
}

const emitEvent = (req, event, users, data ) => {
    console.log("Emitting event", event);
}

const deleteFilesFromCloudinary = async (publicIds) => {
    // delete files
}

export {
    connectDB,
    sendToken,
    cookieOptions,
    emitEvent,
    deleteFilesFromCloudinary
}