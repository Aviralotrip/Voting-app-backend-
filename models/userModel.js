const monggoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new monggoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        
    },
    age: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    role:{
        type:String,
        
        enum:["admin","voter"],
        default:"voter"
    },
    isVoted:{
        type:Boolean,
        default:false
    },
    

})
userSchema.pre('save', async function(next){
    const person = this;

    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();
    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10);

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt);
        
        // Override the plain password with the hashed one
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, this.password);
        return isMatch;
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}
const User = monggoose.model("User", userSchema);
module.exports = User