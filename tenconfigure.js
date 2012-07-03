var serverConfig = require('./serverConfig.js');

var redis = require ('redis'), 
	redisClient = redis.createClient(serverConfig.serverSettings.redis.port, serverConfig.serverSettings.redis.host);

var configKey = "globalConfiguration";

var possibleBreathCounts = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var possibleNegReinforcement = [0, 1, 2];

exports.possibleBreathCounts = possibleBreathCounts;
exports.possibleNegReinforcement = possibleNegReinforcement;

exports.setConfiguration = function (cfg){
	console.log('Posted Info:');
	console.log(cfg);
	var config = {};
	config.breathCount = cfg.breathCount;
	config.availableStages = {
		gardenPath: {
			name: 'Garden Path',
			value: cfg.gardenPath || 'false',
		},
		cityScape: {
			name: 'City Scape',
			value: cfg.cityScape || 'false',
		},
		stairway:  {
			name: 'Stairway',
			value: cfg.stairway || 'false',
		}
	};
	config.negReinforcement = cfg.negReinforcement;	
	redisClient.set(configKey, JSON.stringify(config));
	
};

exports.getConfiguration = function (cb){
	redisClient.get(configKey, function (error, res){
		if (error){
			console.log("CONFIGURATION ERROR:" + error);		
		}else{
			res = JSON.parse(res);
			cb(res);
		}
	});

};

exports.buildConfigForConfigPage = function (cb){
	var buildInfo = {};
	redisClient.get(configKey, function (error, res){
		globalConfig = JSON.parse(res);
		buildInfo.globalConfig = globalConfig;
		buildInfo.globalConfig.pageInfo = serverConfig.configPageInfo;
		buildInfo.globalConfig.possibleBreathCounts = possibleBreathCounts;
		buildInfo.globalConfig.possibleNegReinforcement = possibleNegReinforcement;
		cb(buildInfo);
	});

};