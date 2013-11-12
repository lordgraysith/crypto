var lengthIndex 
, patternIndex
, dictionary;

$(function(){

	eventManager.on({eventName: 'loadedDict', listener: loadedDict});
	$('#encryption').on('keyup', encryptionKeyUp);

	loadDict();
});

function encryptionKeyUp(){
	var encryptedWords = $('#encryption').val().split(' ')
	, iter
	, keysets = [];

	for(iter = 0; iter < encryptedWords.length; iter++){
		keysets.push(getPossibleKeys(encryptedWords[iter]));
	}

	console.log(getIntersectOfKeys(keysets));
};

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
		key = createKey();
		for(j = 0; j < input.length; j++){
			key.setValue(input[j], words[i][j]);
		}
		keys.push(key);
	};

	return keys;
};

function getIntersectOfKeys(keysets){
	var finalKeySet
	, keyset
	, key
	, mergedKey
	, mergedKeys
	, i, j, k;

	if(typeof keysets.length === 'undefined' || keysets.length < 1){
		return undefined;
	}

	finalKeySet = keysets[0];

	for(i = 1; i < keysets.length; i++){
		keyset = keysets[i];
		mergedKeys = [];
		for(j = 0; j < finalKeySet.length; j++){
			for(k = 0; k < keyset.length; k++){
				mergedKey = finalKeySet[j].merge(keyset[k]);
				if(typeof mergedKey !== 'undefined'){
					mergedKeys.push(mergedKey);
				}
			}
		}
		for(j = 0; j < mergedKeys.length; j++){
			key = mergedKeys[j];
			if(!finalKeySet.contains(key)){
				finalKeySet.push(key);
			}
		}
		for(j = 0; j < keyset.length; j++){
			key = keyset[j];
			if(!finalKeySet.contains(key)){
				finalKeySet.push(key);
			}
		}
	};

	finalKeySet = finalKeySet.sort(function(a,b){
		var aLength = a.getLength()
		, bLength = b.getLength();

		if(aLength < bLength){
			return -1;
		}
		else if (aLength > bLength){
			return 1;
		}
		else{
			return 0;
		}
	});

	return finalKeySet;
};

function createKey(){
	var key = {}
	, equals = function(other){
		var prop;
		keyNames = this.getAllKeys();
		for(iter = 0; iter < keyNames.length; iter++){
			prop = keyNames[iter];
			if(!other.hasKey(prop)){
				return false;
			}
			else if(this.getValue(prop) !== other.getValue(prop) ){
				return false;
			}
		}

		keyNames = other.getAllKeys();
		for(iter = 0; iter < keyNames.length; iter++){
			prop = keyNames[iter];
			if(!this.hasKey(prop)){
				return false;
			}
		}
		return true;
	}
	, merge = function(other){
		var prop
		, result = createKey()
		, keyNames
		, iter;

		keyNames = this.getAllKeys();
		for(iter = 0; iter < keyNames.length; iter++){
			prop = keyNames[iter];
			if(other.hasKey(prop) && this.getValue(prop) !== other.getValue(prop)){
				return undefined;
			}
			result.setValue(prop, this.getValue(prop));
		}

		keyNames = other.getAllKeys();
		for(iter = 0; iter < keyNames.length; iter++){
			prop = keyNames[iter];
			result.setValue(prop, other.getValue(prop));
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
		, getLength: function(){
			return this.getAllKeys().length;
		}
	};
};