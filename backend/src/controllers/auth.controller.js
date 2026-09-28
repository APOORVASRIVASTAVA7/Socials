import { userExists, createUser, userExistsLogin } from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import argon2 from 'argon2';


export const signup = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            // console.log("Please enter the credentials")
            return res.status(400).json({ error: "Please fill all credentials." });
        }

        // if (password.length <= 6) {
        //     // console.log("Password should be longer than 6 characters");
        //     return res.status(401).json({ error: "Password has to be longer than 6 characters" });
        // }
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            // console.log

            return res.status(401).json({ error: "email format is wrong" });
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(401).json({ error: "Password should contain symbols, numbers and uppercase letters" });
        }

        const exists = await userExists(username, email);
        if (exists) {
            return res.status(400).json({ error: "User already exists. Try logging in." });
        } else {
            //hashes and salts the password
            const hash = await argon2.hash(password);

            await createUser(username, email, hash);

            return res.status(201).json({ message: "User created successfully" });

        }
    } catch (error) {
        // console.error('Server error', 500).json({ message: 'Server error' });
        console.error(error);
        return res.status(500).json({
            message: "Server error"
        });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;

    if (userExistsLogin) {
        const { hashed_password, user_id } = await userExistsLogin(...);

        if (await argon2.verify(password, hashed_password)) {
            //jwt assign
            const token = jwt.sign(
                { user_id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "7d" }
            )

            return res.status(200).json({
                message: "Login Successfully",
                token
            });


        } else {
            return res.send(401).json({ Error: "The password is incorrect" });
        }



    } else {
        // console.error();
        return res.status(404).json({ Error: "User not Found" });
    }
}
