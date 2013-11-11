var lengthIndex 
, patternIndex
, dictionary;

$(function(){

	eventManager.on({eventName: 'loadedDict', listener: loadedDict});

	loadDict();
});

function loadedDict(argObject){
	var dict = argObject.dict;
	dictionary = dict;
	lengthIndex = makeLengthIndex(dict);
	patternIndex = makePatternIndex(dict);
}

function loadDict(){
	$.ajax('/dict.txt', {
		success: function(data){
			var dict = data.split(/\s/i);
			eventManager.trigger({eventName: 'loadedDict', scope: window, argObject: {dict:dict}});
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
		key = createKey;
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
	};

	finalKeySet = finalKeySet.sort(function(a,b){

	});

	return finalKeySet;
};

function createKey(){
	var key = {}
	, equals = function(other){
		var prop;
		for(prop in key){
			if(key.hasOwnProperty(prop)){
				if(!other.key.hasOwnProperty(prop)){
					return false;
				}
				else if(key[prop] !== other.key[prop]){
					return false;
				}
			}
		}
		for(prop in other.key){
			if(other.key.hasOwnProperty(prop)){
				if(!key.hasOwnProperty(prop)){
					return false;
				}
			}
		}
		return true;
	}
	, merge = function(other){
		var prop
		, result = createKey();

		for(prop in key){
			if(key.hasOwnProperty(prop)){
				if(other.key.hasOwnProperty(prop) && key[prop] !== other.key[prop]){
					return undefined;
				}
				result.key[prop] = key[prop];
			}
		}

		for(prop in other.key){
			if(other.key.hasOwnProperty(prop)){
				result.key[prop] = other.key[prop];
			}
		}
		return result;
	};
	return {
		equals: equals
		, merge: merge
		, getValue: function(keyName){
			return key[keyName];
		}
		, hasKey: function(keyName){
			return key.hasOwnProperty(keyName);
		}
		, setValue: function(keyName, value){
			return key[keyName] = value;
		}
		, removeKey: function(keyName){
			delete key[keyName];
		}
		, getAllKeys: function(){
			var result = []
			, prop;
			for(prop in key){
				if(key.hasOwnProperty(prop)){
					result.push(prop);
				}
			}
			return result;
		}
	};
};