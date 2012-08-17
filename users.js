var users = {
		'mycguo' : {login: 'mycguo', password: 'admin', role: 'admin'}
};

module.exports.authenticate = function(login, password, callback) {
	var user = users[login];
	if (!user) {
		callback(null);
		return;
	
	}
	if (user.password = password) {
		callback(user);
		return;
	}
	
	callback(null);
	
}