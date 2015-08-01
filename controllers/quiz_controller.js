var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if(quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) {next(error);});
};

// GET /quizes
exports.index = function(req, res) {	
	//console.log('SEARCH:' + req.query.search);
	
	if(req.query.search !== undefined) { //si estamos buscando filtramos las preguntas		
		//sustituir todas las agrupaciones en blanco por %
		var search2 =  req.query.search.replace(/\s+/g, "%");
		//si no empieza o termina la cadena por % se lo añadimos
		if(search2.charAt(0)!='%') {
			search2 = "%" + search2;
		}
		if(search2.charAt(search2.length-1)!='%') {
			search2 = search2 + "%";
		}
		//console.log('SEARCH2:' + search2);
		models.Quiz.findAll({where:["pregunta LIKE ?", search2],
		                     order:[["pregunta", "ASC"]]}).then(function(quizes){
			res.render('quizes/index', {quizes: quizes, errors:[]});	
		});
	} else { //sino, mostramos todas
		models.Quiz.findAll().then( function(quizes){
			res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
		})
	}
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz, errors:[]});	
	});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto', errors:[]});
		} else {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto', errors:[]});
		}
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	// crea objeto quiz
	var quiz = models.Quiz.build({pregunta:"Pregunta", respuesta: "Respuesta"});
	
	res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	
	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en BD los campos pregunta y respuesta de quiz
			quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
				// redireccion HTTP (URL relativo) lista de preguntas
				res.redirect('/quizes');
			})
		}
	});		
};

// POST /quizes/:id/edit
exports.edit = function(req, res) {
	// autoload de instancia de quiz
	var quiz = req.quiz;
	
	res.render('quizes/edit', {quiz: quiz, errors:[]});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	// machaca el de la BD con el que ha introducido el usuario
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	req.quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			// guarda en BD los campos pregunta y respuesta de quiz
			req.quiz.save({fields:["pregunta", "respuesta"]}).then(function(){
				// redireccion HTTP (URL relativo) lista de preguntas
				res.redirect('/quizes');
			})
		}
	});		
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function(){
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};