var serverConfig = require('./serverConfig.js');

var redis = require ('redis'), 
	redisClient = redis.createClient(serverConfig.redis.port, serverConfig.redis.host);

var configKey = "globalConfiguration";

var possibleBreathCounts = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
var possibleNegReinforcement = [0, 1, 2];
var possiblePlayTimes = [5, 10, 15, 20];

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
	config.sessionTime = cfg.sessionTime;
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
		console.log(globalConfig);
		buildInfo.globalConfig = globalConfig;
		buildInfo.globalConfig.possibleBreathCounts = possibleBreathCounts;
		buildInfo.globalConfig.possibleNegReinforcement = possibleNegReinforcement;
		buildInfo.globalConfig.possiblePlayTimes = possiblePlayTimes;
		cb(buildInfo);
	});

};

exports.defaultConfig = { 
	breathCount: '5',
  	availableStages: 
   	{ 
		gardenPath: { name: 'Garden Path', value: 'true' },
     	cityScape: { name: 'City Scape', value: 'false' },
     	stairway: { name: 'Stairway', value: 'true' }, 
	},
	sessionTime: '20',
}
