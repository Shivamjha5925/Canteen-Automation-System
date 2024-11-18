require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

mongoose.connect(process.env.MONGO_URI);

const seedData = [
  { name: 'Aloo Paratha', price: 35, image: 'https://i.ibb.co/ZXp22jf/aloo-paratha.jpg' },
  { name: 'Chole Kulche', price: 50, image: 'https://i.ibb.co/0MHWQyy/chole-Kulche.jpg' },
  { name: 'French Fries', price: 40, image: 'https://i.ibb.co/0jBZ3MC/frenchfries.jpg' },
  { name: 'Peri Peri Fries', price: 50, image: 'https://i.ibb.co/ZGV2Vwz/periperi.jpg' },
  { name: 'Aloo Patty', price: 20, image: 'https://i.ibb.co/Scmqvfk/patty.jpg' },
  { name: 'Paneer Patty', price: 30, image: 'https://i.ibb.co/Ycdkj6M/paneer-patty.jpg' },
  { name: 'Veg Steam', price: 50, image: 'https://i.ibb.co/NntSBwH/vegsteam.jpg' },
  { name: 'Veg Fried', price: 70, image: 'https://i.ibb.co/khNht7z/vegfried.jpg' },
  { name: 'Paneer Steam', price: 60, image: 'https://i.ibb.co/992JJGQ/paneer-steam.jpg' },
  { name: 'Paneer Fried', price: 70, image: 'https://i.ibb.co/gP4YNRg/paneer-fried.jpg' },
  { name: 'Chicken Steam', price: 60, image: 'https://i.ibb.co/k43ybJ1/chicken-steam.jpg' },
  { name: 'Chicken Fried', price: 70, image: 'https://i.ibb.co/p2Qrrxr/chicken-fried.jpg' },
  { name: 'Cheese Steam', price: 70, image: 'https://i.ibb.co/CwPxHs7/cheese-steam.jpg' },
  { name: 'Cheese Fried', price: 80, image: 'https://i.ibb.co/DzjzSSN/cheese-fried.jpg' },
  { name: 'Veg Burger', price: 59, image: 'https://i.ibb.co/K5qryVF/veg-Berger.jpg' },
  { name: 'Paneer Burger', price: 69, image: 'https://i.ibb.co/CtzFjzK/paneer-Berger.jpg' },
  { name: 'Chicken Burger', price: 79, image: 'https://i.ibb.co/YjZV21Z/chicken-Berger.jpg' },
  { name: 'Chicken Biryani', price: 70, image: 'https://i.ibb.co/RcgYTfC/chicken-Biryani.jpg' },
  { name: 'Mutton Biryani', price: 100, image: 'https://i.ibb.co/7JySzXW/mutton-Biryani.jpg' },
  { name: 'Chicken Tikka', price: 199, image: 'https://i.ibb.co/q9pRMSZ/chicken-Tikka.jpg' },
  { name: 'Paneer Tikka', price: 199, image: 'https://i.ibb.co/yRf8gY4/paneertikka.jpg' },
  { name: 'Tandoori Momo Veg', price: 99, image: 'https://i.ibb.co/WfpKHHY/tandoorimomoveg.jpg' },
  { name: 'Tandoori Momo Nonveg', price: 129, image: 'https://i.ibb.co/TbbNvLx/tandoorimomononveg.jpg' },
  { name: 'Tandoori Momo Paneer', price: 119, image: 'https://i.ibb.co/YkN2zw4/tandoorimomopaneer.jpg' },
  { name: 'Afghani Tikka', price: 149, image: 'https://i.ibb.co/jwC4kJ9/afghanitikka.jpg' },
  { name: 'Afghani Momo', price: 149, image: 'https://i.ibb.co/8c6Msj0/afghanimomo.jpg' },
  { name: 'Veg Chowmein', price: 50, image: 'https://i.ibb.co/ypGxR2p/vegchowmein.jpg' },
  { name: 'Paneer Chowmein', price: 80, image: 'https://i.ibb.co/rGrKz1N/paneerchowmein.jpg' },
  { name: 'Hakka Noodles', price: 80, image: 'https://i.ibb.co/wgQkDFp/hakkanoodles.jpg' },
  { name: 'Manchurian Dry', price: 70, image: 'https://i.ibb.co/2vf33xc/manchurian-Dry.jpg' },
  { name: 'Manchurian Gravy', price: 80, image: 'https://i.ibb.co/tzkZTP0/manchurian-Gravy.jpg' },
  { name: 'Veg Munchow', price: 50, image: 'https://i.ibb.co/VqzCkrw/vegmunchow.jpg' },
  { name: 'Chicken Munchow', price: 70, image: 'https://i.ibb.co/XxM5htx/chicken-Munchow.jpg' },
  { name: 'Hot and Sour', price: 70, image: 'https://i.ibb.co/pXXvbBt/hotnsour.jpg' },
  { name: 'Tomato Soup', price: 50, image: 'https://i.ibb.co/Fhq7c2R/tomatosoup.jpg' },
];

MenuItem.insertMany(seedData)
  .then(() => {
    console.log('Menu data added!');
    mongoose.connection.close();
  })
  .catch(error => console.error('Error adding data:', error));
