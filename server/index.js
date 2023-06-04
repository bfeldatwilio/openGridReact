const { ChatOpenAI } = require("langchain/chat_models/openai");
const { HumanChatMessage, SystemChatMessage, AIChatMessage } = require("langchain/schema");
const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3000;
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use(cors());
app.use(express.json());

app.post("/sign", (req, res) => {
	res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/completions", async (req, res) => {
	const chat = new ChatOpenAI();
	const langMsgArray = req.body.messages.map((message) => {
		if (message.role === "user") {
			return new HumanChatMessage(message.content);
		} else if (message.role === "system") {
			return new SystemChatMessage(message.content);
		} else if (message.role === "assistant") {
			return new AIChatMessage(message.content);
		}
	});
	const response = await chat.call(langMsgArray);
	res.send(response);
});

// app.post("/readabledata", async (req, res) => {
// 	let newId = crypto.randomUUID();
// 	const gridData = JSON.stringify(req.body.input);
// 	const chat = new ChatOpenAI();
// 	const msg0 = new SystemChatMessage(
// 		"You are a helpful assistant.  You convert raw data into useful information for a sales representative."
// 	);
// 	const msg1 = new HumanChatMessage(gridData);
// 	const msg2 = new HumanChatMessage("convert each object into a human readable paragraph");
// 	const response = await chat.call([msg0, msg1, msg2]);
// 	let obj = {
// 		id: newId,
// 		aiResponse: response.text,
// 	};
// 	docsets.push(obj);

// 	res.send({ docId: newId });
// });

// app.post("/query", async (req, res) => {
// 	const { docId, query } = req.body;
// 	const store = docsets.find((doc) => doc.id === docId);

// 	const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 1 });
// 	const splitDocs = await textSplitter.createDocuments([store.aiResponse]);
// 	const vectorStore = await HNSWLib.fromDocuments(splitDocs, new OpenAIEmbeddings());
// 	const result = await vectorStore.similaritySearch(query);
// 	console.log(result);
// 	res.send({ result: result });
// });

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
