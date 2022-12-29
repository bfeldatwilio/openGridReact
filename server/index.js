const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.get("/api", (req, res) => {
	res.json({ message: "response from the server" });
});

app.post("/sign", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
