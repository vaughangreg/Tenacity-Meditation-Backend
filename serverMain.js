
/**
 * Module dependencies.
 */

var serverConfig = require('./serverconfig.js');

var express = require('express'),
 	routes = require('./routes'),
  	http = require('http');

var tenConfig = require ('./tenconfigure.js');
var ejs = require('ejs');
var app = express();

app.configure(function(){
	app.set('port', serverConfig.serverSettings.node.port);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  	app.use(express.errorHandler());
});

app.get('/', routes.index);

app.get('/tenconfig', function (req, res){
	var cfg = {};
	tenConfig.buildConfigForConfigPage(function (configInfo){
		cfg.configInfo = configInfo;
		cfg.pageInfo = serverConfig.configPageInfo;
		console.log(cfg.configInfo.globalConfig);
		res.render('configure', cfg);
			
	});
});


app.post('/setconfig', function (req, res){
	tenConfig.setConfiguration(req.body);
	res.redirect('/tenconfig');
});

app.get('/getconfig', function (req, res){
	tenConfig.getConfiguration(function (config){
		res.json(config);		
	});
});

http.createServer(app).listen(app.get('port'), function(){
  	console.log("Express server listening on port " + app.get('port'));
});

