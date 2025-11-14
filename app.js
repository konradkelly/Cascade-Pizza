import express from "express";
import mysql2 from "mysql2";
import dotenv from "dotenv";

// Load the variables from .env file
dotenv.config();
const app = express();

// Set EJS as our view engine
app.set("view engine", "ejs");

// Enable static file serving
app.use(express.static("public"));

// Allow the app to parse form data(req.body)
app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection pool
const pool = mysql2
	.createPool({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
		port: process.env.DB_PORT,
	})
	.promise();

const PORT = 3000;

// Define a route to test database connection
app.get("/test-db", async (req, res) => {
	try {
		const [orders] = await pool.query("SELECT * FROM orders");
		res.send(orders);
	} catch (error) {
		console.error("Database error:", error);
	}
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/contact-us", (req, res) => {
	res.render("contact");
});

app.get("/confirm", (req, res) => {
	res.render("confirmation");
});

app.get("/admin", async (req, res) => {
	try {
		const [orders] = await pool.query(
			"SELECT * FROM orders ORDER BY timestamp DESC"
		);
		res.render("admin", { orders });
	} catch (error) {
		console.error("Database error:", error);
	}
	//res.send(orders);
	//res.sendFile(`${import.meta.dirname}/views/admin`);
});

// Define a "submit-order" route
app.post("/submit-order", async (req, res) => {
	console.log(req.body);

	const order = req.body;
	order.timestamp = new Date();

	// Write a query to insert order into the DB
	const sql =
		"INSERT INTO orders (fname, lname, email, size, method, toppings, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)";

	// Create array of parameters for each placeholder
	const params = [
		order.fname,
		order.lname,
		order.email,
		order.size,
		order.method,
		order.toppings,
		order.timestamp,
	];

	try {
		const [result] = await pool.execute(sql, params);

		// Send user to confirmation page
		res.render("confirmation", { order });
	} catch (error) {
		console.log("Database error: ", error);
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
