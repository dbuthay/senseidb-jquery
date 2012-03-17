(function($){
    if(!$.SenseiUI){
        $.SenseiUI = new Object();
    };
    
    $.SenseiUI = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
       
        // Add a reverse reference to the DOM object
        base.$el.data("SenseiUI", base);
        
        base.init = function(){
            
            base.options = $.extend({},$.SenseiUI.defaultOptions, options);

            // flatten listeners .. make our lives easier
            base.options.listeners = _.reduce(base.options.listeners, function(a,b) { return a.add(b) }, $()); 

            // announce ourselves to our listeners .. they may want to call us back
            $.each( base.options.listeners, function(i, v){
              var senseiListener = $(v).data("SenseiUI.Listener");
              if (senseiListener) { 
                senseiListener.setSenseiUI(base);
              }
            });
    

            // call all our listeners when a query returns
            base.requestCallback = function() {
              var callbackArgs = arguments;
              $.each( base.options.listeners, function(i, v) {
                  $(v).trigger('SenseiUI.search.success', callbackArgs);
              });
            } 


            // what to call when asked for search by
            // - form events
            // - listener events
            base.searchCallback = function() {
              s = new SenseiClient();
              s.query = base.$el.val();
              
              // TODO handle query mangling
              s.request(base.requestCallback);
            };


            $(base.el.form).on('submit', function(ev){
              ev.preventDefault();
              base.searchCallback();
            }); 

            base.$el.on('SenseiUI.search.trigger', function(ev) {
              base.searchCallback();
              ev.preventDefault();
            });
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.SenseiUI.defaultOptions = {
      listeners: $()
    };
    
    $.fn.senseiUI = function(options){
        return this.each(function(){
            (new $.SenseiUI(this, options));
        });
    };
    
    // This function breaks the chain, but returns
    // the SenseiUI if it has been attached to the object.
    $.fn.getSenseiUI = function(){
        this.data("SenseiUI");
    };
    
})(jQuery);
