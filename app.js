//cd Onedrive/Desktop/Yelpcamp
//C3zuqbZukfe9kpwi
//mongodb+srv://our-first-user:<password>@cluster0.rhjo9mn.mongodb.net/?retryWrites=true&w=majority
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}



const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash=require('connect-flash');
const session=require('express-session')
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');

const campgroundRoutes=require('./routes/campgrounds');
const reviewRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');

const MongoDBStore = require('connect-mongo')(session);

const dbUrl= 'mongodb://localhost:27017/yelp-camp';
//mongodb://localhost:27017/yelp-camp
//connecting to database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true,
    //useFindAndModify: false

});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


const secret=process.env.SECRET || 'this should be a better secret !';

const store=new MongoDBStore({
    url:dbUrl,
    secret,
    touchAfter:24*60*60
});

store.on("error",function(e){
    console.log("Sessionstore Error",e)
})

const sessionConfig={
    store,
    secret,
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }


}
app.use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());//to initialize passport
app.use(passport.session()) // for persistent login
passport.use(new LocalStrategy(User.authenticate())); // hi passport we wuld like to use the local strategy that i dowloaded
passport.serializeUser(User.serializeUser()); //store ser in session
passport.deserializeUser(User.deserializeUser()); //destore user in session

app.use((req,res,next)=>{
    
    res.locals.currentUser=req.user;  //from passport 
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.get('/fakeUser', async (req,res)=>{
    const user=new User({email:'ritikcrj@gmail.com', username:'ritikkr'});
    //to register new user
     const newUser=await User.register(user,'chicken') //chickem is password
      res.send(newUser);
})

//including routes
app.use('/',userRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
});




app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})


