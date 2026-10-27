//hash, verify and sign token
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
    existsByUsernameOrEmail,
    createUser,
    findByIdentity
} from "../models/user.model.js";

import env from "../config/env.js";


export const signup = async (username, email, password) => {

    const userExists = await existsByUsernameOrEmail(username, email);

    if (userExists) {
        const error = new Error("Username or email already exists");
        error.statusCode = 409;
        throw error;
    }

    const password_hash = await argon2.hash(password);

    const user = await createUser(
        username,
        email,
        password_hash
    );

    return user;
};


export const login = async (identifier, password) => {

    const user = await findByIdentity(identifier);

    if (!user) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await argon2.verify(
        user.password_hash,
        password
    );

    if (!isPasswordValid) {
        const error = new Error("Invalid credentials");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            user_id: user.user_id
        },
        env.JWT_SECRET_KEY,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user_id: user.user_id
    };
};