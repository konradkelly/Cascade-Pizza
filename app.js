import express from "express";

const app = express();

// Enable static file serving
app.use(express.static("public"));

// Allow the app to parse form data
app.use(express.urlencoded({ extended: true }));

// Create an array to store orders
const orders = [];

const PORT = 3000;

app.get("/", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/home.html`);
});

app.get("/contact-us", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/contact.html`);
});

app.get("/confirm", (req, res) => {
	res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

app.get("/admin", (req, res) => {
	res.send(orders);
	//res.sendFile(`${import.meta.dirname}/views/admin`);
});

app.post("/submit-order", (req, res) => {
	console.log(req.body);
	const order = {
		fname: req.body.fname,
		lname: req.body.lname,
		email: req.body.email,
		method: req.body.method,
		toppings: req.body.toppings,
		size: req.body.size,
		comment: req.body.comment,
	};
	console.log(order);

	orders.push(order);
	console.log(orders);
	//res.sendFile(`${import.meta.dirname}/views/confirmation.html`);
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
