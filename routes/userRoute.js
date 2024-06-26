const express = require("express");
const router = express.Router();
const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const User = require("../models/userModel");

//signup route for user


router.post('/signup',async(req,res)=>{
    try {
        // take data from request body
        const data = req.body;
        // Check if there is already an admin user
        const adminUser = await User.findOne({role:"admin"});
        if(adminUser){
            // if admin user is already present
            return res.status(400).json({message:"Admin user already exists"});
        }
        // validate Aadhar card number of 12 digits by regex
        if(!/^\d{12}$/.test(data.aadharCardNumber)){
            return res.status(400).json({message:"Aadhar card number must be 12 digits"});
        }
        // Check if user with same aadhar exist or not
        const user = await User.findOne({aadharCardNumber:data.aadharCardNumber});
        if(user){
            return res.status(400).json({message:"User with same Aadhar card number already exists"});
        }
        // create new user
        const newUser = await new User(data);
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);

        res.status(200).json({response: response, token: token});

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}) 
 

//login route for user


router.post('/login',async(req,res)=>{
    try {
        // take data from request body
        const {aadharCardNumber,password} = req.body;
        //check if data is complete or not
        if(!aadharCardNumber || !password){
            return res.status(400).json({message:"Please provide aadhar card number and password"});
        }
        //find user with this aadhar number and match password
        const user = await User.findOne({aadharCardNumber:aadharCardNumber});
        if(!user ||  !(await user.comparePassword(password))){
            return res.status(400).json({message:"Invalid Aadhar card number or password"});
        }
        const payload = {
            id:user.id,
        }
        console.log(JSON.stringify(payload));
        
        const token = generateToken(payload);

        // resturn token as response
        res.json({token,message:"Login successful"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


//profile route for user

router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
    try {
        const userData = req.user;
        const userId = userData.id;
        const user = await User.findById(userId);
        res.status(200).json({user});
    } catch (error) {
        console.log("Internal server error");
    }
})


//update profile route for user

router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
    try {
        //Extract the user ID from the JWT token
        const userId = req.user.id;
        //Extract the new password and old password from the request body
        const {password,newpassword} = req.body;
        //Check if new password and old password is provided
        if(!password && !newpassword){
            return res.status(400).json({message:"Please provide new password and old password"});
        }
        // Find the user in the database
        const user = await User.findById(userId);
        // Compare the old password with the password in the database
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid old password"});
        }
        //Update the user's password
        user.password = newpassword;
        await user.save();
        res.status(200).json({message:"Password updated successfully"});
    } catch (error) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
module.exports = router;