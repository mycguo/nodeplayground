/**
 * Module dependencies.
 */

var express = require('express'), routes = require('./routes'), http = require('http');

var products = require('./products');

var fs = require('fs');

var app = express();

var MemStore = express.session.MemoryStore;

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser({
		uploadDir : './public/upload/photos'
	}));
	app.use(express.methodOverride());

	app.use(express.static(__dirname + '/public'));
	app.use(express.cookieParser());
	app.use(express.session({
		secret : 'secret_key',
		store : MemStore({
			reapInterval : 60000 * 10
		})
	}))
	app.use(app.router);
});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpException : true
	}));
});

app.get('/', function(req, res) {
	res.render('index', {
		title : 'express'
	});

});

app.get('/products', function(req, res) {
	res.render('products/index', {
		products : products.all
	})
});

app.get('/products/new', function(req, res) {
	console.log("calling new");
	res.render('products/new', {
		product : req.body && req.body.product || products.newp()
	});
})

app.post('/products', function(req, res) {
	var id = products.insert(req.body.product);
	res.redirect('products');
})

app.get('/products/:id', function(req, res) {
	console.log("calling show");
	var product = products.find(req.params.id);
	res.render('products/show', {
		product : product
	})
});

app.get('/products/:id/edit', function(req, res) {
	var product = products.find(req.params.id);
	res.render('products/edit', {
		product : product
	})
});

app.put('/products/:id', function(req, res) {
	console.log("replace POST with PUT");
	var prod = {
		name : req.body.product_name,
		description : req.body.product_description,
		price : req.body.product_price
	};
	console.log("name: " + req.params.id);
	products.set(req.params.id, prod);
	res.redirect('/products/' + req.params.id);

});

app.get('/show', function(req, res) {
	var filename = req.query["fileName"];
	console.log("show " + fileName);
	fs.readFile(fileName, "binary", function(error, file) {
		if (error) {
			response.writeHead(500, {
				"Content-Type" : "text/plain"
			});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {
				"Content-Type" : "image/png"
			});
			response.write(file, "binary");
			response.end();
		}
	});
})

app.get('/photos/new', function(req, res) {
	res.render('photos/new');
});

// http://www.hacksparrow.com/handle-file-uploads-in-express-node-js.html
app.post('/photos', function(req, res) {
	console.log(req.body);
	console.log(req.files);

	// get the temporary location of the file
	var tmp_path = req.files.photo.path;
	// set where the file should actually exists - in this case it is in the
	// "images" directory
	var target_path = './public/upload/photos' + req.files.photo.name;
	// move the file from the temporary location to the intended location
	fs.rename(tmp_path, target_path, function(err) {
		if (err)
			throw err;
		// delete the temporary file, so that the explicitly set temporary
		// upload dir does not get filled with unwanted files
		fs.unlink(tmp_path, function() {
			if (err)
				throw err;
			console.log('File uploaded to: ' + target_path + ' - '
					+ req.files.photo.size + ' bytes');
		});
	});
	// res.redirect('/show?fileName=' + target_path);
	res.redirect('/products');

})

// sessions

var users = require('./users');
app.get('/sessions/new', function(req, res) {
	res.render('sessions/new', {
		redir : req.query.redir
	});
})

app.post('/sessions', function(req, res) {
	users.authenticate(req.body.login, req.body.password, function(user) {
		if (user) {
			sess = req.session;
			session.user = user;
			res.redirect(req.body.redir || '/');
		} else {
			req.flash('warn', 'login failed');
			res.render('sessions/new', {
				redir : req.body.redir
			});
		}
	})
})

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});
