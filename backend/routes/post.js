const express = require('express');
const requireLogin = require('../middleware/requireLogin')
const Post = require('../models/post');
const User = require('../models/user');
const router = express.Router();

router.post('/createpost', requireLogin, (req, res)=> {
    const {body, pic} = req.body
    if(!body || !pic) {
        return res.status(422).json({error:"Please add all the fields"})
    } else {
        const post = new Post({
            body,
            photo: pic,
            postedBy: req.user._id
        })
        post.save()
        .then(savedpic=> {
            res.json({post:savedpic})
        })
    }
})

router.get('/allpost', requireLogin, (req, res)=> {
    Post.find()
    .sort("-createdAt")
    .populate("postedBy", "_id name")
    .then(posts=> {
        res.json({posts})
    })
    .catch(err=> {
        console.log("An error occured")
    })
})

router.get('/mypost', requireLogin, (req, res)=> {
    Post.find({postedBy:req.user._id})
    .populate("postedBy", "_id name")
    .then(myposts=> {
        res.json({myposts})
    })
    .catch(err=> {
        console.log("An error occured")
    })
})

router.delete('/deletepost/:postId', requireLogin, (req, res)=> {
    Post.findOne({_id: req.params.postId})
    .populate("postedBy", "_id name")
    .exec((err, post)=> {
        if(err || !post) {
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            post.remove()
            .then(result=> {
                res.json({result})
            })
            .catch(err=> {
                console.log("An error occured" +err)
            })
        }
    })
})

router.get('/user/:id', requireLogin, (req, res)=> {
    User.findOne({_id:req.params.id})
    .then(user=> {
        Post.find({postedBy:req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, posts)=> {
            if(err || !posts) {
                return res.status(422).json({error:"No User found"})
            } else {
                return res.status(422).json({user, posts})
            }
        })
    })
    .catch(err=> {
        console.log("An error occured" +err)
    })
})

module.exports = router;