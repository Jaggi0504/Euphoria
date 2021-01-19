const express = require('express');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user');
const { JWT_SECRET } = require('../keys');
const router = express.Router();


router.post('/signin', (req, res)=> {
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(422).json({error:"Please fill all the fields"})
    } else {
        User.findOne({email:email})
        .then(savedUser=> {
            if(!savedUser) {
                return res.status(422).json({error:"Invalid email id or password"})
            } else {
                bcrypt.compare(password, savedUser.password)
                .then(doMatch=> {
                    if(doMatch) {
                        const token = jwt.sign({_id:savedUser.id}, JWT_SECRET)
                        const {_id, name, email, pic} = savedUser
                        return res.json({token, user:{_id, name, email, pic}})
                    } else {
                        return res.status(422).json({error:"Invalid email id or password"})
                    }
                })
                .catch(err=> {
                    console.log("An error occured" +err)
                })
            }
        })
        .catch(err=> {
            console.log("An error occured" +err)
        })
    }
})

router.post('/signup', (req, res)=> {
    const {email, name, password, pic} = req.body;
    if(!email || !name || !password) {
        return res.status(422).json({error:"Please fill all the fields"})
    } else {
        User.findOne({email:email})
        .then(savedUser=> {
            if(savedUser) {
                return res.status(422).json({error:"A user with same email id already exists. Please use a different email id"})
            } else {
                bcrypt.hash(password, 12)
                .then(hashedPassword=> {
                    const user = new User({
                        name, 
                        email, 
                        password: hashedPassword,
                        pic
                    })
                    user.save()
                    .then(userdata=> {
                        return res.status(200).json({message:"User added successfully. Login to continue"})
                    })
                    .catch(err=> {
                        console.log("An error occured")
                    })
                })
            }
        })
        .catch(err=> {
            console.log("An error occured")
        })
    }
})

module.exports = router;