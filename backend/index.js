const express = require('express');
const cors = require('cors');
require("./db/config");
const User = require("./db/user");
const Product = require("./db/product");
const app = express();
app.use(express.json());
app.use(cors());
const jwt = require('jsonwebtoken');
const jwtkey = 'e-com-dashboard';

app.post('/reg', async(req,res)=>{
    const { name, userName, email, phoneNo, password, cpassword } = req.body;
    // Create a new user instance with the provided data
    let user = new User({
        name,
        userName,
        email,
        phoneNo,
        password,
        cpassword
    });

    try {
        // Save the user to the database
        let result = await user.save();
        result = result.toObject();
        delete result.password;
        delete result.cpassword;
        jwt.sign({result},jwtkey,(error,token)=>{
            if(error){
                res.send({result:'something went wrong please try again'})
            }
        res.status(200).send({result,auth: token});
        })
    } catch (error) {
        // Handle validation errors or other errors
        console.error(error);
        res.status(400).send(error);
    }
})
app.post('/login', async (req, res) => {
    if (req.body.password && req.body.email){
        let user = await User.findOne(req.body).select("-password").select("-cpassword");
        if (user) {
            jwt.sign({user},jwtkey,(error,token)=>{
                if(error){
                    res.send({result:'something went wrong please try again'})
                }
            res.status(200).send({user,auth: token});
            })
        }else{
            res.status(404).send("Not Found");
        }
    }else{
        res.send("Username or password not found");
    }
});

app.post('/add-product', async(req,res)=>{
    const { title,price,category,company,desc } = req.body;
    // Create a new user instance with the provided data
    let product = new Product({
        title,
        price,
        category,
        company,
        desc
    });
    try {
        // Save the user to the database
         product = await product.save();
        res.send(product);
    } catch (error) {
        // Handle validation errors or other errors
        console.error(error);
        res.status(400).send(error);
    }
})
    app.get("/products", async (req, res) => {
        try {
            let products = await Product.find();
            if (products.length > 0) {
                res.status(200).send(products);
            } else {
                res.status(404).send("No products found");
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.delete("/product/:id", async (req, res) => {
        try {
            const result = await Product.deleteOne({ _id: req.params.id });
            if (result.deletedCount === 0) {
                return res.status(404).send("Product not found");
            }
            res.send("Product deleted successfully");
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    app.get("/product/:id", async (req, res) => {
            let result = await Product.findOne({_id: req.params.id});
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(404).send("No products found");
            }
       
    });  
    app.put("/product/:id", async (req, res)=>{
        let result = await Product.updateOne(
            {_id:req.params.id},
            {
                $set : req.body 
            }
        )
        res.status(200).send(result);
    });

    // -----------------------------------add token function-----------------------------------------
    // function verifyToken(req,res,next){
    //     let token= req.headers['authorization'];
    //     if(token){
    //         token = token.split(" ");
    //         jwt.verify(token,jwtkey,(error, valid)=>{
    //             if(error){
    //                 res.status(401).send("please add valid token")
    //             }
    //             else{
    //                 next();
    //             }
    //         })
    //     }
    //     else{
    //         res.status(403).send("please add token with header")
    //     }
    //     console.warn("Middleware called",token)
    //     next();
    // }

app.listen(5000);
 