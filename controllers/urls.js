const  shortid  = require('shortid');
const URL = require('../models/urls'); // Make sure this path points to your URL model

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if(!body.url) return res.status(400).json({ error: "url is required"});
    const shortID  = shortid.generate(8);

    const url = new URL({
        shortId: shortID,
        redirectURL: body.url, // This matches your schema's redirectURL field
        visitHistory: [],
    });

    await url.save();
    return res.render('home', { 
        id: shortID,
        urls: await URL.find({})
    });
}

async  function handleGateAnalytics(req, res){
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
    // result.visitHistory.push({ timestamp: Date.now() });
    // await result.save();
    // res.redirect(result.redirectURL);
}

module.exports = {
    handleGenerateNewShortURL,
    handleGateAnalytics,
}