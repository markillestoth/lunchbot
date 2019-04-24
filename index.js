// index.js

var LunchBot = require('./lib/lunchbot');
var FacebookSource = require('./lib/sources/facebook');
var luncherSource = require('./lib/sources/luncher');
var Parsers = require('./lib/parsers');
var Filters = require('./lib/filters');

var config = require('config');
var Promise = require('bluebird');

var token = config.get('slack.api');
var name = config.get('slack.name');

process.on('uncaughtException', function(err) {
    console.log(err);
});

process.on('exit', function() {
    console.log('Process exiting');
});

var bot = new LunchBot({
    token: token,
    name: name,
    usesReactionVoting: config.get('slack.usesReactionVoting')
});

var params = {
    chains: [
        {
            parser: Parsers.weeklyMenu,
            filter: Filters.startOfWeek
        },
        {
            parser: Parsers.basicPrice,
            filter: Filters.sameDay
        }
    ]
};

//
//  Sources
//

// Menza
const menza = new FacebookSource('menza', 'Menza', "222194971977", params);

// Vian
const vian = new FacebookSource('vian', 'Café Vian', "332656680123482", params);

// 2 szerecsen
const ketszer = new FacebookSource('two', 'Két Szerecsen', "142749389074745", params);

// Krízia
const krizia = new FacebookSource('it', 'Krízia', "73573241551", params);

// Kiadó
const kiado = new FacebookSource('beer', 'Kiadó', "39889323341", params);


const services = [menza, vian, ketszer, krizia, kiado];
console.log('Starting LunchBot with ' + services.length + ' services');

bot.services = services;
bot.run();
