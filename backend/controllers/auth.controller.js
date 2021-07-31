const USER = require('../models/user.model');
const createErrore = require('http-errors');
const { signSchema, loginSchema } = require('../helpers/schema.validator');
const { signAccessToken, signRefreshToken, vertifyRefreshToken } = require('../helpers/jwt')

module.exports = {
    register: async (req, res, next) => {
        try {
            const result = await signSchema.validateAsync(req.body);
            const doesExist = await USER.findOne({
                email: result.email
            });
            if (doesExist) throw res.status(400).json(createErrore.Conflict(`email: ${result.email} is used`));

            const newUser = await USER({
                userName: result.userName,
                email: result.email,
                password: result.password,
            })
            const savedUser = await newUser.save();
            const accessToken = await signAccessToken(savedUser.id);
            const refreshToken = await signRefreshToken(savedUser.id);

            res.json({
                success: 'ok',
                user: savedUser,
                accessToken,
                refreshToken
            })
        } catch (error) {
            next(res.status(400).send(createErrore.BadRequest(error.message)));
        }

    },
    login: async (req, res, next) => {
        try {
            const result = await loginSchema.validateAsync({
                email: req.body.email,
                password: req.body.password
            })
            const user = await USER.findOne({
                email: result.email
            });

            if (!user) throw createErrore.NotFound("this user not register");
            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) throw createErrore.Unauthorized('email/password is not valid');

            const accessToken = await signAccessToken(user.id);
            const refreshToken = await signRefreshToken(user.id);

            res.json({
                success: 'ok',
                user,
                accessToken,
                refreshToken
            })

        } catch (error) {

            if (error.isJoi === true) next(res.status(400).json(createErrore.BadRequest('Invalid email or password')))
            next(res.status(400).json(error))
        }
    },
    refreshToken: async (req, res, next) => {
        const { refreshToken } = req.query;

        try {

            if (!refreshToken) throw createErrore.BadRequest();
            const userId = await vertifyRefreshToken(refreshToken)

            const newAccess = await signAccessToken(userId);
            const newRefresh = await signRefreshToken(userId);
            const userData = await USER.findById(userId);


            res.json({
                success: 'ok',
                user: userData,
                accessToken: newAccess,
                refreshToken: newRefresh
            })

        } catch (error) {
            throw error
        }
    }
}