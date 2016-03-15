;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "flickrAlbum",
        defaults = {
          api_key: "",
          photoset_id: "72157624286813182",
          listed_size: "s", //size for the list of images. "s" is a thumnail of 75x75 px. All sizes are listed here: https://www.flickr.com/services/api/misc.urls.html
          sinlge_size: "z" //size for a single image. The link is inserted in the listed image attribute "data-photo_item_url". All sizes are listed here: https://www.flickr.com/services/api/misc.urls.html
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            get_photoset_url="https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+this.options.api_key+"&photoset_id="+this.options.photoset_id+"&format=json&nojsoncallback=1";

            var create_thumbs_function = this.create_thumbs;
            var element = this.element;
            var options = this.options;

            $.ajax({
              dataType: "json",
              url: get_photoset_url,
              success: function(data){
                if(data.stat!="fail"){
                  create_thumbs_function(element, options, data);
                }else{
                  console.log("Error getting data from Flickr API: " + data.message);
                }
              }
            });

        },

        create_thumbs: function(el, options, data) {
          photos_wrapper = el;
          $.each(data['photoset']['photo'], function() {
            photo_item_thumb_url="https://farm"+this['farm']+".staticflickr.com/"+this['server']+"/"+this['id']+"_"+this['secret']+"_"+options.listed_size+".jpg";
            photo_item_url="https://farm"+this['farm']+".staticflickr.com/"+this['server']+"/"+this['id']+"_"+this['secret']+"_"+options.single_size+".jpg";
            photo_item = $("<img />").attr("src", photo_item_thumb_url).attr('data-photo_item_url', photo_item_url).addClass('flickr_photo_thumb');
            $(photos_wrapper).append(photo_item);
          });
        }
    };


    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );
