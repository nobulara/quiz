var users = {bob: {id:1, username:"bob", password:"esponja"},
             patricio:  {id:2, username:"patricio", password:"estrella"}
            };

// Comprueba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	if(users[login]) {
		if(password === users[login].password) {
			callback(null, users[login]);
		} else {
			callback(new Error('Password erróneo.'));
		}				
	} else {
		callback(new Error('No existe el usuario.'));
	}
}