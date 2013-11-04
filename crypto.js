var lengthIndex 
, patternIndex
, dictionary;

$(function(){

	eventManager.on('loadedDict', loadedDict);

	loadDict();
});

function loadedDict(dict){
	dictionary = dict;
	lengthIndex = makeLengthIndex(dict);
	patternIndex = makePatternIndex(dict);
}

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
		if(pattern === null){
			continue;
		}
		if(typeof results[pattern] === 'undefined'){
			results[pattern] = [];
		}		
		results[pattern].push(dict[i]);
	}
	return results;

};

function makePattern(word){
	var i
	, container = {}
	, letter
	, pattern = [];

	if(word.length < 1){
		return null;
	}

	for(i = 0; i < word.length; i++){
		letter = word[i];
		if(typeof container[letter] === 'undefined'){
			container[letter] = [];
		}		
		container[letter].push(i);
	}

	for(i = 0; i < word.length; i++){
		letter = word[i];
		if(typeof container[letter] !== 'undefined'){
			pattern.push(container[letter].join(','));
			delete container[letter];
		}		
	}

	return pattern.join(';');
};

function getPossibleKeys(input){
	var words = patternIndex[makePattern(input)]
	, keys = []
	, key
	, i, j;

	for (i = 0; i < words.length; i++) {
		key = {};
		for(j = 0; j < input.length; j++){
			key[input[j]] = words[i][j];
		}
		keys.push(key);
	};

	return keys;
};

function getIntersectOfKeys(keysets){
	var finalKeySet
	, keyset
	, i;

	for(i = 0; i < keysets.length; i++){
		keyset = keysets[i];
		
	};
};