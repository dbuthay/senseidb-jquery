(function($){
    
    $.SenseiUI.Renderer = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("SenseiUI.Renderer", base);
        
        base.init = function(){
            base.options = $.extend({},$.SenseiUI.Renderer.defaultOptions, options);
            
            // Put your initialization code here
            base.$el.bind("SenseiUI.search.searching", function(e) {
                base.$el.css({opacity: 0.5});
            });

            base.$el.bind("SenseiUI.search.success", function(e, data) {
                base.options.setupContainer(base.$el);
                $(data.results).each( function (i, item) {
                    var r = base.options.format(item);
                    r.appendTo(base.$el);
                });
                base.$el.css({opacity: 1});
                base.options.afterRender(base.$el);
            });

            base.$el.bind("SenseiUI.search.failure", function(e) {
                base.$el.css({opacity: 1});
            });
            
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
       
        // Run initializer
        base.init();
    };
    
    $.SenseiUI.Renderer.defaultOptions = {
        format: function(item){
                    return $("<div></div>")
                            .addClass("result")
                            .append( $("<a></a>").attr("href", item.link || item.url ).text(item.title || item.name) )
                            .append( $("<span></span>").addClass("description").html(item.snippet_text || item.text) );
                    },
        setupContainer: function($el){
            $el.html("");
        },
        afterRender: function($el) {
            // do nothing. You may want to re arrange items,
            // append some sort of legend, zebra items, you name it.      
        }
    };
    
    $.fn.SenseiRenderer = function(options){
        return this.each(function(){
            (new $.SenseiUI.Renderer(this, options));
        });
    };
    
})(jQuery);
