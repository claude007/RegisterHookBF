const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customers = require("../modules/CustomersModule");

router.post("/register", (res, req) => {
    customers.find({ email: req.body.email })
    .exec()
    .then((customer) => {
      if (customer.length >= 1) {
        return res.status(401).json({
          status: false,
          message: "Email exist",
          data: undefined,
        });
      } else {
        bcrypt.hash(req.body.password, 2, (err, hash) => {
          if (err) {
            return res.status(501).json({
              status: false,
              message: "Cannot bcrypt the password",
              data: undefined,
            });
          } else {
            const customer = new customers({ ...req.body, password: hash });
            customer.save(err, doc);
            if (err)
              return res.status(501).json({
                status: false,
                message: err,
                data: undefined,
              });

            return res.status(200).json({
              status: false,
              message: "register sussceffully ",
              data: doc,
            });
          }
        });
      }
    });
});

module.exports = router;
