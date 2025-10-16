import express from "express";

const app = express();

// Enable static file serving
app.use(express.static("public"));

const PORT = 3000;

app.get("/", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/home.html`);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
