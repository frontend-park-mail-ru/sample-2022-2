const http = require('http');
const fs = require('fs');

const SERVER_PORT = 3002;

const server = http.createServer((req, res) => {
	const {url} = req;

	console.log('request', url);

	const fileName = url === '/' ? '/index.html' : url;

	fs.readFile(`${__dirname}/../public${fileName}`, (err, data) => {
		if (err) {
			console.log('error', url, 'not found');
			res.write('404 not found');
			res.end();
			return;
		}

		res.write(data);
		res.end();
	});

});

server.listen(SERVER_PORT);
