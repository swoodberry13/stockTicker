var readline = require("readline");
var fs = require("fs");
const MongoClient =require('mongodb').MongoClient;


var readline = require('readline'); 
var file = readline.createInterface({input: fs.createReadStream('companies-1.csv')});

file.on('line', async function(line) {
	console.log(line);

	var lineData = line.split(',');
	var company = lineData[0];
	var ticker = lineData[1];
	var price = lineData[2];


	//Connect to MongoDB
	const { MongoClient } = require('mongodb');

	async function connectAndAdd(doc) {
		const url = "mongodb+srv://sloanwoodberry:NOSQL@cluster0.jeroq5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

		try {
			console.log("trying to mongo");
			const client = new MongoClient(url);
			await client.connect();
			const db = client.db("stock");
			const collection = db.collection('PublicCompanies');
			const result = await collection.insertOne(doc);
			client.close();
			cosole.log("finished mongoing")
		} 
		catch (err) {
			console.log("failed to mongo")
			console.error("Error:", err);
		}
	}

		const doc = {
			company: company,
			ticker: ticker,
			price: price
		};
	connectAndAdd(doc);

});