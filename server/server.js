const express = require("express");
const twilio = require("twilio");
const admin = require("firebase-admin");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

console.log("Starting server...");

// init firebase admin
const serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

console.log("Firebase initialized successfully");

// twilio config
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
const client = twilio(accountSid, authToken);

console.log("Twilio configured successfully");

// send verification code
app.post("/send-verification", async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        error: "Invalid phone number format",
      });
    }
    // const phoneNumber = process.env.YOUR_PHONE_NO;

    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    console.log(`Verification sent: ${verification.sid} to ${phoneNumber}`);

    res.json({
      success: true,
      message: "Verification code sent successfully",
      sid: verification.sid,
      status: verification.status,
    });
  } catch (error) {
    console.error("Error sending verification:", error);

    // Handle specific Twilio error codes
    if (error.code === 60200) {
      errorMessage = "Invalid phone number";
      statusCode = 400;
    } else if (error.code === 60203) {
      errorMessage = "Phone number not verified (trial account)";
      statusCode = 400;
    } else if (error.code === 20429) {
      errorMessage = "Too many requests. Please wait before trying again.";
      statusCode = 429;
    } else if (error.code === 60202) {
      errorMessage = "Max send attempts reached for this phone number";
      statusCode = 429;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

// verify code
app.post("/verify-code", async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;
    // phoneNumber = process.env.YOUR_PHONE_NO;

    if (!phoneNumber || !code) {
      return res.status(400).json({
        success: false,
        error: "Phone number and verification code are required",
      });
    }

    const verificationCheck = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });

    console.log(
      `Verification check: ${verificationCheck.sid}, Status: ${verificationCheck.status}`
    );

    if (verificationCheck.status === "approved") {
      const userDoc = await db.collection("users").doc(phoneNumber).get();

      res.json({
        success: true,
        message: "Phone number verified successfully",
        phoneNumber: phoneNumber,
        // userExists: userDoc.exists(),
        // userData: userDoc.exists() ? userDoc.data() : null,
        verificationSid: verificationCheck.sid,
      });
    } else {
      res.status(400).json({
        success: false,
        error: "Invalid verification code",
        status: verificationCheck.status,
      });
    }
  } catch (error) {
    console.error("Error verifying code:", error);

    let errorMessage = "Failed to verify code";
    let statusCode = 500;

    // Handle specific Twilio error codes
    if (error.code === 20404) {
      errorMessage = "Verification code not found or expired";
      statusCode = 400;
    } else if (error.code === 60202) {
      errorMessage = "Max verification attempts reached";
      statusCode = 429;
    } else if (error.code === 60023) {
      errorMessage = "No pending verification found for this phone number";
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = 3005;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
  console.log(`Using Twilio Verify Service: ${verifySid}`);
});

module.exports = app;
