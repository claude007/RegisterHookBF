const express = require('express')
const router = express.Router()
const auth = require('../../middelware/auth')
const User = require('../modules/User')
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken"); 
const config = require("config");
var bcrypt = require("bcryptjs");

//api/auth
router.get('/', auth, async (req, res)=> {

    try {
       const user = await User.findById(req.user.id).select('-password')
       res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Errer')
    }
})


//POST api/auth
//autenticate use rand get token
router.post(
    "/",
    // username must be an email
    body("email", "please enter a valid email!!").isEmail(),
    // password must be at least 5 chars long
    body("password", "password is required!").exists(),
    async (req, res) => {
      {
        // console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          //important to put the return here to avoid message in console
          return res.status(400).json({ errors: errors.array() });
        }
        //deconstruction
        const { email, password } = req.body;
        try {
          // user exist or not!
          let user = await User.findOne({ email });
          if (!user) {
            //important to put the return here to avoid message in console
            return res
              .status(400)
              .json({ error: [{ msg: "invalid credential" }] });
          }

          //match email and password
          const isMatch = await bcrypt.compare(password, user.password)
          if(!isMatch) {
            return res
            .status(400)
            .json({ error: [{ msg: "invalid credential" }] });
          }
  
          //return jwt
          const payload = {
            user: {
              id: user.id
            },
          };
  
          jwt.sign(
            payload, 
            config.get("jwtSecret"),
            {expiresIn: 360000},
            (err, token)=> {
              if(err) throw err;
              res.json({token})
            }
            );
  
          // res.send("user registred");
        } catch (err) {
          console.error(err.message);
          res.status(500).send("server error");
        }
      }
    }
  );
  


module.exports = router