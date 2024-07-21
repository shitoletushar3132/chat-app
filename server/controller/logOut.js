async function logOut(req, res) {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure only in production
      sameSite: "None", // Necessary for cross-origin requests
    };
    return res.cookie("token", "", cookieOptions).status(200).json({
      message: "session out",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = logOut;
