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
	, key1
	, key2
	, mergedKey
	, mergedKeys
	, i, j, k;

	if(typeof keysets !== 'array' || keysets.length < 1){
		return undefined;
	}

	finalKeySet = keysets[0];

	for(i = 1; i < keysets.length; i++){
		keyset = keysets[i];
		mergedKeys = [];
		for(j = 0; j < finalKeySet.length; j++){
			for(k = 0; k < keyset.length; k++){
				mergedKey = mergeKeys(finalKeySet[j], keyset[k]);
				if(typeof mergedKey !== 'undefined'){
					mergedKeys.push(mergedKey);
				}
			}
		}
		for(j = 0; j < mergedKeys.length; j++){
			finalKeySet.push(mergedKeys[j]);
		}
		for(j = 0; j < keyset.length; j++){
			finalKeySet.push(keyset[j]);
		}
		finalKeySet = removeDuplicates.apply(finalKeySet);
	};

	finalKeySet = finalKeySet.sort(function(a,b){

	});

	return finalKeySet;
};

function removeDuplicates(){
	var result = []
	, i;

};

function mergeKeys(key1, key2){
	var prop
	, result = {};

	for(prop in key1){
		if(key1.hasOwnProperty(prop)){
			if(key2.hasOwnProperty(prop) && key1[prop] !== key2[prop]){
				return undefined;
			}
			result[prop] = key1[prop];
		}
	}

	for(prop in key2){
		if(key2.hasOwnProperty(prop)){
			result[prop] = key2[prop];
		}
	}
	return result;
};