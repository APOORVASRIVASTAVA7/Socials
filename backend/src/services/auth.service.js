//hash, verify and sign token
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import {
    existsByUsernameOrEmail,
    createUser,
    findByIdentity
} from "../models/user.model.js";

import env from "../config/env.js";
import AppError from "../utils/AppError.js";


export const signup = async (username, email, password) => {

    const userExists = await existsByUsernameOrEmail(username, email);

    if (userExists) {
        throw new AppError(
            "Username or email already exists",
            409
        );
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
        throw new AppError(
            "Invalid credentials",
            401
        );
    }

    const isPasswordValid = await argon2.verify(
        user.password_hash,
        password
    );

    if (!isPasswordValid) {
        throw new AppError(
            "Invalid credentials",
            401
        );
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