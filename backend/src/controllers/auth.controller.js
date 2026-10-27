import { signup, login } from "../services/auth.service.js";
import env from "../config/env.js";


export const signupController = async (req, res, next) => {
    try {

        const { username, email, password } = req.body;

        const user = await signup(
            username,
            email,
            password
        );

        return res.status(201).json({
            message: "User registered successfully",
            user
        });

    } catch (error) {
        next(error);
    }
};


export const loginController = async (req, res, next) => {
    try {

        const { identifier, password } = req.body;

        const { token } = await login(
            identifier,
            password
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login successful"
        });

    } catch (error) {
        next(error);
    }
};