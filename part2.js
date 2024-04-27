var http = require('http');
var url = require('url');
const MongoClient =require('mongodb').MongoClient;
const port = process.env.PORT || 3000;;

http.createServer(async function (req, res) {

res.writeHead(200, {'Content-Type':'text/html'});
var queryObject = url.parse(req.url, true).query;
var pathName = url.parse(req.url, true).pathname;

if (pathName == "/") {
html = "<form method='GET' action='/process'>" +
"<label for='stock'>Search by stock symbol or company name</label></br>" +
"<input type='text' id='stock' name='stock'></input></br>" + 
"<input type='radio' id='symbol' name='radio' value='symbol'></input>" + 
"<label for='symbol'>symbol</label></br>" +
"<input type='radio' id='name' name='radio' value='name'></input>" +
"<label for='name'>name</label></br>" + 
"<input type='submit' value='Search'>" +
"</form>";
res.write(html);
}
else if (pathName == "/process") {
res.write("Proccessed search");
var stock = queryObject.stock;

if (queryObject.radio == "symbol") {
query = { "symbol": `${stock}`};
} else {
query = { "name": `${stock}`};
}


//Connect Mongo
const url = "mongodb+srv://sloanwoodberry:NOSQL@cluster0.jeroq5g.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);
res.write("connecting to mongo");
await client.connect();
res.write("connected to mongo");
// Select db and collection
const db_object = client.db("stock");
const collection = db_object.collection('PublicCompanies');

//store results 
const results = collection.find(query);

resultsString = ``;
// Print document info
for await (const doc of results) {
console.dir("Name: " + doc.name);
console.dir("Symbol: " + doc.symbol);
console.dir("Price: " + doc.price);
res.write(`<div><p>${doc.name}, ${doc.symbol}: $${doc.price}</p></div>`)
}

// Close database
await client.close();
} else {
res.write("Unknown page request");
res.end();
}
}).listen(port);