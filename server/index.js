const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY;

app.get("/api", (req, res) => {
	res.json({ message: "response from the server" });
});

app.post("/sign", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/completions", async (req, res) => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			messages: req.body.messages,
			max_tokens: 100,
		}),
	};
	try {
		const response = await fetch("https://api.openai.com/v1/chat/completions", options);
		const data = await response.json();
		res.send(data);
	} catch (error) {
		console.error(error);
	}
});

app.post("/embeddings", async (req, res) => {
	const options = {
		method: "POST",
		headers: {
			Authorization: `Bearer ${API_KEY}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-3.5-turbo",
			input: JSON.stringify(req.body.gridData),
			max_tokens: 100,
			user: "open-grid-app",
		}),
	};
	try {
		const response = await fetch("https://api.openai.com/v1/embeddings", options);
		const data = await response.json();
		res.send(data);
	} catch (error) {
		console.error(error);
	}
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
