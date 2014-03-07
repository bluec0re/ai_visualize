function Class() { }
Class.prototype.construct = function() {};
Class.extend = function(def)
{
    var classDef = function()
    {
        if (arguments[0] !== Class)
        {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.construct.apply(this, arguments);
        }
    };
    var proto = new this(Class);
    var superClass = this.prototype;
    for (var n in def)
    {
        //noinspection JSUnfilteredForInLoop
        var item = def[n];
        if (item instanceof Function) item.$ = superClass;
        //noinspection JSUnfilteredForInLoop
        proto[n] = item;
    }
    classDef.prototype = proto;
    classDef.extend = this.extend;
    return classDef;
};
