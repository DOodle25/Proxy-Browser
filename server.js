// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/proxy", async (req, res) => {
//     try {
//         const url = req.query.url;
//         if (!url) {
//             return res.status(400).send("Please provide a URL!");
//         }
//         const response = await axios.get(url);
//         res.send(response.data);
//     } catch (error) {
//         res.status(500).send("Error fetching the page!");
//     }
// });

// // Use dynamic port assigned by Render
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/:website(*)", async (req, res) => {
    try {
        const website = req.params.website;
        if (!website) {
            return res.status(400).json({ error: "Invalid request!" });
        }

        const targetUrl = `https://${website}`; // Automatically use HTTPS
        console.log(`Fetching: ${targetUrl}`); // Log the request

        const response = await axios.get(targetUrl, {
            headers: { ...req.headers }, // Forward request headers
            responseType: "arraybuffer", // Support all content types
        });

        res.set(response.headers); // Keep original response headers
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error("Request failed:", error.message);
        res.status(error.response?.status || 500).json({ error: "Failed to fetch the website" });
    }
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VPN Proxy running on port ${PORT}`));
