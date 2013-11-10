var eventManager = (function(){
	var listeners = {};
	function on(eventObj){
		var listener = eventObj.listener
		, eventName = eventObj.eventName;

		if(typeof listeners[eventName] === 'undefined'){
			listeners[eventName] = [];
		}

		listeners[eventName].push(listener);
	};

	function trigger(eventObj){
		var scope = eventObj.scope || window
		, eventName = eventObj.eventName
		, argObject = eventObj.argObject
		, iter;

		if(typeof listeners[eventName] !== 'undefined'){
			for(iter = 0; iter < listeners[eventName].length; iter++){			
				listeners[eventName][iter].apply(scope, [argObject]);
			}
		}
		
	};

	return{
		on: on
		, trigger: trigger
	};
})();

Array.prototype.contains = function(object){
	var iter;

	for(iter = 0; iter < this.length; iter++){
		if(equals(object, this[iter])){
			return true;
		}
	}

	return false;

	function equals(objA, objB){
		if(typeof objA.equals === 'function'){
			return objA.equals(objB);
		}
		else{
			return objA === objB;
		}
	};
};