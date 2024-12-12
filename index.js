const express = require('express');
const {connectToMongoDB} = require("./connect");
const URL = require('./models/urls');

const urlRoute = require('./routes/urls');
const staticRoute = require('./routes/staticRoutes');
const userRoute = require('./routes/user');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line
app.set('view engine', 'ejs');

const PORT = 8001;

// URL redirection route
app.get('/urls/:shortId', async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOne({ shortId });
        
        if (!entry) {
            return res.status(404).json({ error: "URL not found" });
        }

        entry.visitHistory.push({ timestamp: Date.now() });
        await entry.save();

        res.redirect(entry.redirectURL);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// Home page route with error handling
app.get('/', async (req, res) => {
    try {
        const urls = await URL.find({});
        res.render('home', { urls: urls });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});


connectToMongoDB('mongodb://localhost:27017/short-url')
.then(() => console.log("MongoDB Connected"));

app.use('/', staticRoute);
app.use('/urls', urlRoute);
app.use('/user', userRoute);

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`));
