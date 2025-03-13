const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/proxy", async (req, res) => {
    try {
        const url = req.query.url;
        if (!url) {
            return res.status(400).send("Please provide a URL!");
        }
        const response = await axios.get(url);
        res.send(response.data);
    } catch (error) {
        res.status(500).send("Error fetching the page!");
    }
});

// Use dynamic port assigned by Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
