var express=require('express'),
mongoose=require('mongoose'),
passport=require('passport'),
User=require('./models/user'),
bodyParser=require('body-parser'),
LocalStrategy=require('passport-local'),
passportLocalMongoose=require('passport-local-mongoose');

var app=express();

//MONGODB SERVER START.

mongoose.connect("mongodb://localhost:27017/auth_demo_app",{useNewUrlParser: true});
app.set('view engine','ejs');
//To get POST request
app.use(bodyParser.urlencoded({extended:true}));

//THE SECTION BELOW HAS PASSPORT STUFF
app.use(require('express-session')({
	secret: "This is my saved secret statement",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//SETTING UP NODE SERVER

const PORT = 3000;
app.listen(PORT,process.env.IP,function(){
	console.log("Node+Express Server has started!!!");
});

//SETTING UP ROUTES
app.get("/",function(req,res){
	res.render("home");
});

//LOGIN MIDDLEWARE
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.get("/secret",isLoggedIn,function(req,res){
	res.render("secret");
});

//SIGNUP ROUTES
app.get("/register",function(req,res){
	res.render("register");
});

app.post("/register",function(req,res){
	req.body.username
	req.body.password
	User.register(new User({username: req.body.username}),req.body.password,function(err,user){
		if(err){
			console.log("ERROR!!!");
			return res.render('register');
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/secret");
		});
	});
});

//LOGIN ROUTES
app.get("/login",function(req,res){
	res.render("login");
});

//LOGIN POST ROUTE
app.post("/login",passport.authenticate("local",{successRedirect:"/secret",failureRedirect:"/login"}),function(req,res){
   console.log("Login attempt");
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});

