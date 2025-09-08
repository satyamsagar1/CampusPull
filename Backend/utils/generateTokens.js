import jwt from "jsonwebtoken";

export function signAccessToken(user) {
    return jwt.sign({
        id: user._id,      // user id
      role: user.role,   // add role here

    }, process.env.JWT_ACCESS_SECRET,{
    expiresIn: process.env.JWT_Access_Expires || '15m',
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