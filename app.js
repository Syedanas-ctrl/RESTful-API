const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema);

// app.get("/articles",(req,res)=>{
//     Article.find({},(err, foundArticles)=>{
//         if(!err){
//             res.send(foundArticles);
//         }else{
//             console.log(err);
//         }
//     });
// });

// app.post("/article", (req, res)=>{
//     const newArticle = new Article({
//         title: req.body.title,      //here since we dont have a front end the data entered into post is send using postman 
//         content: req.body.content
//     });
//     newArticle.save((err)=>{
//         if(!err){
//             res.send("successful post");
//         }else{
//             res.send(err);
//         }
//     });
// });

// app.delete("/article", (req,res)=>{
//     Article.deleteMany({},(err)=>{
//         if(!err){
//             res.send("deleted everything");
//         }else{
//             res.sendFile(err);
//         }
//     });
// });

//the above code can also be written using express' route()
app.route("/article")
    .get((req,res)=>{
        Article.find({},(err, foundArticles)=>{
            if(!err){
                res.send(foundArticles);
            }else{
                console.log(err);
            }
        });
    })
    .post((req, res)=>{
        const newArticle = new Article({
            title: req.body.title,      //here since we dont have a front end the data entered into post is send using postman 
            content: req.body.content
        });
        newArticle.save((err)=>{
            if(!err){
                res.send("successful post");
            }else{
                res.send(err);
            }
        });
    })
    .delete((req,res)=>{
        Article.deleteMany({},(err)=>{
            if(!err){
                res.send("deleted everything");
            }else{
                res.sendFile(err);
            }
        });
    });

app.route("/article/:articleTitle")
    .get((req,res)=>{
        Article.findOne({title: req.params.articleTitle}, (err, foundArticle)=>{
            if(!err){
                res.send(foundArticle);
            }else{
                res.send("No artilce found on this topic");
            }
        });
    })
    .put((req,res)=>{
        Article.update({title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (err)=>{
                if(!err){
                    res.send("successfully updated");
                }else{
                    res.send(err);
                }
            });
    })
    .patch((req,res)=>{
        Article.update({title: req.params.articleTitle},
            {$set:  req.body},
            (err)=>{
                if(!err){
                    res.send("successfully updated");
                }else{
                    res.send(err);
                }
            })
    })
    .delete((req,res)=>{
        Article.deleteOne({title: req.params.articleTitle},
            (err)=>{
                if(!err){
                    console.log("Operation successfull");
                }else{
                    console.log(err);
                }
            });
    });

app.listen(3000, ()=>{
    console.log("web is running");
})