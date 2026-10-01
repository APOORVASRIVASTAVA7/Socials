import 'dotenv/config';
import { existsByUsernameOrEmail, createUser, findByIndentity } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';

export const signup = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all credentials." });
        }

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {

            return res.status(400).json({ message: "email format is wrong" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,128}$/;
        if (!passwordRegex.test(password)) {
            return res.status(401).json({ message: "Password must be 8-128 characters with uppercase, lowercase, a number and a symbol." });
        }

        const exists = await existsByUsernameOrEmail(username, email);
        if (exists) {
            return res.status(409).json({ message: "User already exists. Try logging in." });
        } else {
            //hashes and salts the password
            const hash = await argon2.hash(password);

            await createUser(username, email, hash);

            return res.status(201).json({ message: "User created successfully" });

        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

export const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = await findByIndentity(identifier);
        if (!user) {
            return res.status(400).json({ message: "Password entered is incorrect" });
        }

        const { hashed_password, user_id } = user;
        if (await argon2.verify(password, hashed_password)) {
            //jwt assign
            const token = jwt.sign(
                { user_id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            )
            //JWT in HttpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production"? true: false,
                sameSite: "strict", 
                maxAge: 7*24*60*60*1000 //milliseconds in 7 days 
            });

            return res.status(200).json({
                message: "Login Successfully",
            });
        } else {
            return res.status(400).json({
                message: "Password entered is incorrect!"
            });
        }

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "User not Found" });
    }
}
