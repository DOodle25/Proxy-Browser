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
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/:website(*)", async (req, res) => {
//     try {
//         const website = req.params.website;
//         if (!website) {
//             return res.status(400).json({ error: "Invalid request!" });
//         }

//         const targetUrl = `https://${website}`; // Automatically use HTTPS
//         console.log(`Fetching: ${targetUrl}`); // Log the request

//         const response = await axios.get(targetUrl, {
//             headers: { ...req.headers }, // Forward request headers
//             responseType: "arraybuffer", // Support all content types
//         });

//         res.set(response.headers); // Keep original response headers
//         res.status(response.status).send(response.data);
//     } catch (error) {
//         console.error("Request failed:", error.message);
//         res.status(error.response?.status || 500).json({ error: "Failed to fetch the website" });
//     }
// });

// // Use dynamic port for deployment
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`VPN Proxy running on port ${PORT}`));




// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/:website(*)", async (req, res) => {
//     try {
//         let website = req.params.website;
//         if (!website) return res.status(400).json({ error: "Invalid request!" });

//         // Ensure it has a proper protocol
//         let targetUrl = website.startsWith("http://") || website.startsWith("https://") 
//             ? website 
//             : `https://${website}`;

//         console.log(`Fetching: ${targetUrl}`);

//         // Fetch the website with headers and full response data
//         const response = await axios.get(targetUrl, {
//             headers: { ...req.headers },
//             responseType: "arraybuffer",
//         });

//         res.set(response.headers); // Preserve response headers
//         res.status(response.status).send(response.data);
//     } catch (error) {
//         console.error("Request failed:", error.message);

//         // Handle site restrictions or invalid domains
//         res.status(error.response?.status || 500).json({
//             error: "Failed to fetch the website. Some sites block proxy requests.",
//         });
//     }
// });

// // Use dynamic port for deployment
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`VPN Proxy running on port ${PORT}`));





// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");

// const app = express();
// app.use(cors());

// app.get("/:website(*)", async (req, res) => {
//     try {
//         let website = req.params.website;
//         if (!website) return res.status(400).json({ error: "Invalid request!" });

//         // Ensure correct URL format
//         let targetUrl = website.startsWith("http://") || website.startsWith("https://") 
//             ? website 
//             : `https://${website}`;

//         console.log(`Fetching: ${targetUrl}`);

//         const response = await axios.get(targetUrl, {
//             headers: {
//                 ...req.headers,
//                 "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
//                 "Referer": "https://google.com",
//             },
//             maxRedirects: 5, // Follow up to 5 redirects
//             responseType: "arraybuffer", // Support all content types
//             withCredentials: true, // Forward cookies
//         });

//         res.set(response.headers); // Preserve response headers
//         res.status(response.status).send(response.data);
//     } catch (error) {
//         console.error("Request failed:", error.message);

//         // Handle blocked sites properly
//         res.status(error.response?.status || 500).json({
//             error: "This website blocks proxy requests or requires JavaScript execution.",
//         });
//     }
// });

// // Use dynamic port for deployment
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`VPN Proxy running on port ${PORT}`));




const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/:website(*)", async (req, res) => {
    let browser;
    try {
        let website = req.params.website;
        if (!website) return res.status(400).json({ error: "Invalid request!" });

        let targetUrl = website.startsWith("http://") || website.startsWith("https://") 
            ? website 
            : `https://${website}`;

        console.log(`Fetching with Puppeteer: ${targetUrl}`);

        // Launch Puppeteer
        browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Set a real User-Agent
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        );

        await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });

        // Get the page content (including JavaScript-rendered content)
        const content = await page.content();

        res.status(200).send(content);
    } catch (error) {
        console.error("Puppeteer request failed:", error.message);
        res.status(500).json({ error: "This website requires JavaScript execution and cannot be fetched with a simple proxy." });
    } finally {
        if (browser) await browser.close();
    }
});

// Use dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`VPN Proxy running on port ${PORT}`));
