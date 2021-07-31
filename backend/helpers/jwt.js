const jwt = require('jsonwebtoken');
const createError = require('http-errors');

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.ACCESS_TOKEN_SECRET;
            jwt.sign({ userId }, secretKey, { expiresIn: '1d' }, (err, token) => {
                if (err) reject(createError.InternalServerError());
                resolve(token)
            })
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const secretKey = process.env.REFRESH_TOKEN_SECRET;
            jwt.sign({ userId }, secretKey, { expiresIn: '1y' }, (err, token) => {
                if (err) {
                    reject(createError.InternalServerError());
                }
                else resolve(token)
            })
        })
    },
    vertifyAccessToken: (req, res, next) => {
        // check if authorization header is exist
        const authHeader = req.headers['authorization'];
        if (!authHeader) next(res.status(401).json(createError.Unauthorized()))

        const bearerToken = authHeader.split(' ')[1];

        jwt.verify(bearerToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                switch (err.name) {
                    case 'JsonWebTokenError': // if token is invalid
                        return next(res.status(401).json(err));

                    case 'TokenExpiredError': // if tokens is expired
                        return next(res.status(400).json(err));

                    default:
                        return next(res.status(401).json(err))
                }
            }
            req.payload = payload;
            next()
        })

    },
    vertifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, payload) => {
                if (!payload) reject(createError.Unauthorized('invalid refershToken'))
                const userId = payload.userId;
                // console.log('vertify refresh token userId -->' + userId)
                resolve(userId)
            })
        })
    }

}