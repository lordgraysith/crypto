var lengthIndex 
, dictionary;

$(function(){

	eventManager.on('loadedDict', function(dict){
		dictionary = dict;
		lengthIndex = makeLengthIndex(dict);
	});

	loadDict();
});

function loadDict(){
	$.ajax('/dict.txt', {
		success: function(data){
			var dict = data.split(/\s/i);
			eventManager.trigger('loadedDict', window, dict);
		}
	});
};

function makeLengthIndex(dict){
	var i
	, results = {}
	, currentLength;

	for(i = 0; i < dict.length; i++){
		currentLength = dict[i].length;
		if(typeof results[currentLength] === 'undefined'){
			results[currentLength] = [];
		}
		results[currentLength].push(dict[i]);
	}
	return results;
};

function makePatternIndex(dict){
	var i
	, results = {}
	, pattern;

	for(i = 0; i < dict.length; i++){
		pattern = makePattern(dict[i]);
		if(typeof results[pattern] === 'undefined'){
			results[pattern] = [];
		}		
		results[pattern].push(dict[i]);
	}
	return results;

};

function makePattern(word){
	
};