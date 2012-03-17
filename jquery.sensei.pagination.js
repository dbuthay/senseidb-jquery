(function($){
    $.SenseiUI.Pagination = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("SenseiUI.Pagination", base);
        base.$el.data("SenseiUI.Listener", base);
        
        base.init = function(){
            base.options = $.extend({},$.SenseiUI.Pagination.defaultOptions, options);


            base.$el.bind( "SenseiUI.search.success", function (event, data) {
                base.$el.show();
                base.$el.html("");

                // let's find out the current page
                var currentPage = Math.ceil( data.query.start / data.query.rsLength ) + 1;
                // and how many are there 
                var totalPages  = Math.ceil( data.matches / data.query.rsLength );

                // nothing to see here .. go on!
                if (totalPages < 2 ) return; 

                var ul = $("<ul/>").addClass("pagination");

                // first, put selected page
                ul.append ( base.options.formatPage(currentPage, true) ) ;
               

                var shifts = [];
                for (i = 0; i < base.options.maxPages; i++) {
                    shifts.push(i);
                    shifts.push(-1 * i)
                } 
 

                var pushed = 0;
                for (i = 0; i < shifts.length; i++ ) {
                    if (pushed == base.options.maxPages - 1) break; 


                    var checkPage = currentPage + shifts[i];

                    // going back
                    if (shifts[i] < 0 ) {
                        if ( ( checkPage ) > 0 ) {
                            var li = base.options.formatPage( checkPage, false) ;
                            li.data("SenseiUI.Pagination.page", checkPage);
                            li.data("SenseiUI.Pagination.data", data);
                            ul.prepend( li );
                            pushed++;
                        }
                    } 

                    // going forward
                    if (shifts[i] > 0 )  {
                        if (( checkPage ) <= totalPages ) {
                            var li = base.options.formatPage( checkPage, false) ;
                            li.data("SenseiUI.Pagination.page", checkPage);
                            li.data("SenseiUI.Pagination.data", data);
                            ul.append(li);
                            pushed++;
                        }
                    }

                }

                // fix for zero-size, floating non-clickable list items
                ul.append( $("<div/>").css({ clear: "both" }) );

                // make pages clickable
                $("li", ul).click(function(e){
                    // make sure the event is prevented .. we don't want
                    // users navigating away
                    e.preventDefault();

                    var $this = $(this);
                    var d = $this.data("SenseiUI.Pagination.data");
                    var p = $this.data("SenseiUI.Pagination.page");

                    var q = d.query.clone();
                    q.withStart (q.rsLength * (p - 1 )) ;

                    // trigger the query
                    d.senseiUI.trigger("SenseiUI.search.trigger", q);
                });

                
                ul.appendTo(base.$el);
            });
        };
        
       
        base.setSenseiUI = function(senseiUI) {
          base.senseiUI = senseiUI;
        };
 
        // Run initializer
        base.init();
    };
    
    $.SenseiUI.Pagination.defaultOptions = {
        // max number of pages to show on the list.
        // THIS IS NOT LAST POSSIBLE PAGE
        maxPages: 10,
        formatPage: function(page, selected) {
            var li = $("<li/>").text(page);
            if (selected) {
                li.addClass("selected");
            } 

            // no need to handle clicks here .. 
            // that's what this plugin is for!

            return li;
        }
    };


    $.fn.SenseiPagination = function(options){
        return this.each(function(){
            (new $.SenseiUI.Pagination(this, options));
        });
    };
    
})(jQuery);
