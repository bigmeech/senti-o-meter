var csv =       require("csv-stream");
var _ =    require("lodash");
var fs =        require("fs");

//csv config
var config = {
    delimiter:  ',',
    endLine:    '\n',
    columns:    ['word','score'],
    escapeChar:  '"',
    enclosedChar:   '"'
}

//convert sentence into an array of words
var tokenizer = function(input){
    return input.replace(/^\s+|\s+$/g,'')
        .toLocaleLowerCase()
        .split(' ')
}


function Sentometer(phrase, callback){
    //check
    var words = tokenizer(phrase),
        pos = 0,
        neg = 0;
        nuetral = []
        afinns = [];
    var sentiment = {}

    fs.createReadStream('./data/AFINN.csv')
        .pipe(csv.createStream(config))
        .on('data',function(data){ afinns.push(data) })
        .on('end', function(){
            var matches = []
            _(words).forEach(function(word){
                afinns.forEach(function(afinn){
                    if(afinn.word === word){
                        matches.push(afinn.word);
                        if(afinn.score > 0) pos += Number(afinn.score);
                        if(afinn.score < 0) neg += Number(afinn.score);}
                })
            });
            callback({
                matchedWords:matches,
                postive:pos,
                negative:neg});
        })
}

Sentometer.prototype.add = function(word, score){
    console.log(word, score, "- added!")
}

module.exports = Sentometer;