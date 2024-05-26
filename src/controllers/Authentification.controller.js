require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Userdb = require('../models/User.model');

exports.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};


exports.generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username,
        name: user.name,
    };
    // const JWT_SECRET =  "jhgihfzf!°97896987908/.?8è!ç";
    // return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });
};

exports.verifyToken = (token) => {
    const JWT_SECRET =  "jhgihfzf!°97896987908/.?8è!ç";
    try {
        // return jwt.verify(token, process.env.JWT_SECRET);
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return false;
    }
};



exports.verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({status:401, error: 'Non autorisé' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.verifyToken(token);

    if (!decoded) {
        return res.status(403).json({status:403, error: 'Interdit' });
    }
    req.user = decoded;
    next();
};

exports.authUser = async (req, res) => {

    try {
        const { username, password } = req.body;

        const user = await Userdb.findOne({ username: username }).select('name username password');
        if (!user) {
            return res.status(404).json({ status:400,message: 'Email ou mot de passe est incorrect' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ status:400,message: 'Email ou mot de passe est incorrect' });
        }

        const token = this.generateToken(user);

        res.json({ status:200,message:"Success",token,name:user.name });
    } catch (error) {
        res.send({ ststus: 400, mesage: error.message });
    }

};



exports.createUserInit = async (req, res) => {

    try {
        // password: "develop"
        var tab = [
            { name: "ANTOENJARA Noam Francisco", username: "antoenjara1998@gmail.com", password: "$2b$10$m2aXw5FCTMKvMxt68u9hv.sXzdngzJapKIIHjnKJNkGDQiZrIZoZu" },
            { name: "TOMBOANJARA Claudio", username: "claudmja2.0@gmail.com", password: "$2b$10$m2aXw5FCTMKvMxt68u9hv.sXzdngzJapKIIHjnKJNkGDQiZrIZoZu" },
        ];
        const listUserInit = await Userdb.find();

        if (listUserInit.length > 0) {

            res.send({ status: 400, message: "Utilisateur déjà initialisé" });

        } else {
            const Insert = await Userdb.insertMany(tab);
            res.send({ status: 200, message: "Utilisateur initialisé avec succès" });
        }
    } catch (error) {
        console.log("createUserInit error: " + error.message);
        res.send({ ststus: 400, mesage: error.message });
    }

};