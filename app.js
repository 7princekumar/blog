//SETUP 1
var express          = require("express"),
    app              = express(),
    mongoose         = require("mongoose"),
    bodyParser       = require("body-parser"),
    methodOverride   = require("method-override"),
    expressSanitizer = require("express-sanitizer");
    
// APP CONFIG 
mongoose.connect("mongoDB://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());  //sanitizer MUST be after body-parser
app.use(methodOverride("_method"));


// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body:  String,
    created: {type: Date, default: Date.now}
});
var Blog = mongoose.model("blog", blogSchema);

// //Create a new blog
// Blog.create({
//     title: "Test Blog",
//     image: "https://images.unsplash.com/photo-1494756739853-38af58aa9dd0?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=2d1847968ade334f3193ae40a2bb99f2&dpr=1&auto=format&fit=crop&w=376&h=251&q=60&cs=tinysrgb",
//     body: "Hello, this is a blog post."
// });



// RESTFULL ROUTES
app.get("/", function(req, res){
   res.redirect("/blogs"); 
});

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
        } else {
                res.render("index", {blogs:blogs});
        }
    });
});

// NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body); //SANITIZE
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            res.redirect("/blogs");
        }
    });
});


// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    //   :id -> req.params.id
   Blog.findById(req.params.id, function(err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("show", {blog: foundBlog});
      }
   });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog:foundBlog}); 
        }
    });
   
});


// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body); //SANITIZE
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlod){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" +req.params.id);
        }
    });
});


// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
    //delete
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});


//SETUP 2
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Blog Server Started!"); 
});