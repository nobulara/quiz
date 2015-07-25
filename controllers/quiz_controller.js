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
	models.Quiz.findAll().then( function(quizes){
		res.render('quizes/index.ejs', {quizes: quizes});
	})
};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		res.render('quizes/show', {quiz: req.quiz});	
	});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz){
		if(req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {quiz: req.quiz, respuesta: 'Incorrecto'});
		}
	});
};