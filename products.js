var products = [ {
	id : 1,
	name : 'iphone',
	description : '4s',
	price : 1000

}, {
	id : 2,
	name : 'iPad',
	description : 'New IPad',
	price : 1000

} ];

module.exports.all = products;

module.exports.find = function(id) {
	id = parseInt(id,10);
	var found = null;
	productloop: for (product_index in products) {
		var product = products[product_index];
		if (product.id == id) {
			found = product;
			break productloop;
		}
	};
	return found;
}

module.exports.set = function(id,product) {
	id = parseInt(id,10);
	product.id = id;
	products[id - 1] = product;
}

module.exports.newp = function() {
	return {
		name: '',
		description: '',
		price: 0
	};
}

module.exports.insert = function(product) {
	id = products.length;
	products[id] = product;
	return id;
	
}