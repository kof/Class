/*
 * A lightweight classical inheritance emulation
 * 
 * @version 0.3
 * @credits http://www.crockford.com/javascript/inheritance.html
 *          http://webreflection.blogspot.com/2009/02/on-javascript-inheritance-performance_28.html
 *          http://webreflection.blogspot.com/2010/02/javascript-override-patterns.html
 * @license Dual licensed under the MIT and GPL licenses.
 * @author  Oleg Slobodskoi aka Kof
 * @website http://jsui.de
 */

this.Class = (function(slice, noop, undefined){

    function Class( _class ) {
        
        /**
         * Create instance from class definition, call init function
         * @return {Object} inst
         */
        function instantiate() {
            var args = slice.call(arguments, 0),
                inst;
            // call all superclasses definitions
            for ( var i=0; i < _class.classes.length; ++i ) {
                if ( inst ) {
                    noop.prototype = inst;
                    // add undefined array member at the 0 position only once 
                    i == 1 && args.unshift(undefined);
                    // every subclass has super instance as first argument, 
                    // create new super object from current instance
                    args[0] = new noop;
                    // create new instance object
                    inst = new noop;
                // if inst is not set, this is the first class we instantiate
                } else {
                    inst = {};
                }
                _class.classes[i].apply(inst, args);    
            }

            typeof inst.init == 'function' && inst.init();
            
            return inst;
        }
        
        /**
         * Register a subclass
         * @param {Function} subclass
         * @return {Function} instantiate
         */
        instantiate.extend = function extend( subclass ) {
            var instantiate = Class(subclass);
            // merge classes array of superclass with classes array of subclass
            subclass.classes.unshift.apply(subclass.classes, _class.classes);
            return instantiate;
        };
        
        // add classes array to the class definition, this array we will pass by instantiation
        _class.classes = [_class];
        
        return instantiate;
    }

    return Class;
    
})(Array.prototype.slice, function(){});