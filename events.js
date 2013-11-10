var eventManager = (function(){
	var listeners = {};
	function on(eventName, listener){
		if(typeof listeners[eventName] === 'undefined'){
			listeners[eventName] = [];
		}
		listeners[eventName].push(listener);
	};
	function trigger(eventName, scope){
		if(typeof listeners[eventName] !== 'undefined'){
			var scope = scope || window
			, args
			, iter1
			, iter2;

			for(iter1 = 0; iter1 < listeners[eventName].length; iter1++){
				args = [];
				for(iter2 = 2; iter2 < arguments.length; iter2++){
					args.push(arguments[iter2]);
				}				
				listeners[eventName][iter1].apply(scope, args);
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

	function equals(objA, objB){

	};
};