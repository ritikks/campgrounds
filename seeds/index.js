const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '6302e258852981455a8c3fe4',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
           
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas itaque ratione dignissimos ducimus mollitia labore aliquam non? Facilis, dolor nam error dolores cupiditate delectus placeat libero. Consequuntur molestiae magnam reprehenderit.',
            
            price: price,
            images: [
                {
                  url: 'https://res.cloudinary.com/ritik-campgrounds/image/upload/v1661424120/YelpCamp/gbxhevcgri3cbk4jurps.jpg',
                  filename: 'YelpCamp/gbxhevcgri3cbk4jurps',
                  //_id: new ObjectId("630751f96a0e3ae4e8ee0185")
                },
                {
                  url: 'https://res.cloudinary.com/ritik-campgrounds/image/upload/v1661424121/YelpCamp/x4uoqd71ulokp6qvnuj1.jpg',
                  filename: 'YelpCamp/x4uoqd71ulokp6qvnuj1',
                 // _id: new ObjectId("630751f96a0e3ae4e8ee0186")
                }
            ]
            
        })

        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})