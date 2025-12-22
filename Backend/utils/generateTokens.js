import jwt from "jsonwebtoken";

export function signAccessToken(user) {
    const userId = user._id ? user._id.toString() : user.id;
    
    return jwt.sign({
        id: userId,
        role: user.role,
    }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: '15m', // Keep it short for security
    });
}

export function signRefreshToken(user, tokenVersion = 0) {
return jwt.sign({id: user._id,
      role: user.role, // optional, can also add here
      tv: tokenVersion }, 
      process.env.JWT_REFRESH_SECRET, {
expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
});
}


export function verifyRefreshToken(token) {
return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}