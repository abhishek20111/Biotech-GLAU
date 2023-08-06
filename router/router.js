const express = require('express')
const router = express.Router()

const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const User = mongoose.model('Biotech')
const bcrypt = require('bcrypt')
const middleware = require('../middleware/middleware.js')
const jwt = require('jsonwebtoken')
const jwtDecode = require('jwt-decode')
const Post = mongoose.model('Biotech_Post')
const Gallery = mongoose.model('Biotech_Gallery')


router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.get('/getAllImages', async (req, res) => {
    console.log("getAllImages");
    try {
        const images = await Gallery.find().sort({ createdAt: -1 });
        res.status(200).json({ data:images });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the images' });
    }
});
 
router.post('/saveImage', async (req, res) => {
    try {
        const {event, imageUrl } = req.body;
        const newImage = new Gallery({event, imageUrl });
        await newImage.save();
        res.status(200).json({ message: 'Image saved successfully', data: newImage });
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while saving the image', error: error });
    }
});
 
router.get('/getposts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json({ posts });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving posts' });
    }
});




router.post('/savePosts', async (req, res) => {
    console.log("savePost");
    const { title, subtitle, content, imageUrl } = req.body;

    try {
        const post = new Post({
            title,
            subtitle,
            content,
            imageUrl,
        });

        await post.save();
        console.log('Post saved successfully');
        res.status(200).json({ message: 'Post saved successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while saving the post' });
    }
});



router.post("/register", async (req, res) => {
    console.log("register");
    const { name, email, password, CurrentUserType } = req.body;
    if (!name || !email || !password || !CurrentUserType) {
        return res.send({ error: "Fill Complete details" })
    }
    console.log(name + " " + email + " " + password + " " + CurrentUserType);

    const encryptedPassword = await bcrypt.hash(password, 10);
    try {
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.json({ error: "User Exists" });
        }
        const response = await User.create({
            name,
            email,
            password: encryptedPassword,
            role: CurrentUserType,
        });
        return res.json({ success: "User Registered Successfully" });
        // res.send({ status: "Data Save Succesfully" });
    } catch (error) {
        res.status(400).send({ message: error });
    }
});

router.post("/loginUser", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ error: "User Not found" });
    }
    if (await bcrypt.compare(password, user.password)) {
        console.log(user);
        const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, process.env.JWT_SECRET, {
            expiresIn: "24h",
        });

        if (res.status(201)) {
            return res.json({ message: "Login Successfully", data: token });
        } else {
            return res.json({ error: "error" });
        }
    }
    res.json({ status: "error", error: "Invalid Authentication" });
});

router.get('/getdetails', middleware, async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the authenticated user

        // Query the database to retrieve all the details for the user
        const userDetails = await User.findById(userId).select('name email role');

        if (!userDetails) {
            return res.status(404).json({ error: 'User details not found' });
        }

        return res.json({ userDetails });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router; 