const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../modules/User");
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//jwt use te secret in the config default json
const config = require("config");

router.post(
  "/",
  // username must be an email
  body("email", "please enter a valid email!!").isEmail(),
  // password must be at least 5 chars long
  body("password", "min length is 5 please!").isLength({ min: 5 }),
  //name shpoud not be empyt
  body("name", "name field should not be empty").not().isEmpty(),
  async (req, res) => {
    {
      // console.log(req.body);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        //important to put the return here to avoid message in console
        return res.status(400).json({ errors: errors.array() });
      }
      //deconstruction
      const { email, name, password } = req.body;
      try {
        // user exist or not!
        let user = await User.findOne({ email });
        if (user) {
          //important to put the return here to avoid message in console
          return res
            .status(400)
            .json({ error: [{ msg: "user already exist" }] });
        }
        //this just create a user, it is not yet saved
        user = new User({
          name,
          email,
          password,
        });

        //encrypt password
        var salt = await bcrypt.genSaltSync(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

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

module.exports = router;
