const router = require('express').Router();
const verify = require('../lib/verifyToken')


router.get('/', verify, (req, res) => {
    res.json({
        posts: {
            title: 'the first post',
            content: 'first content of post'
        }
    })
    // res.send(req.user)
})




module.exports = router;