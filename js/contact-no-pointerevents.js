/* global jQuery */
/*
Pointer events polyfill
 */
(function($){

	var PointerEventsPolyfill = {
		init: function( el ) {
			this.tooltip = el;
			this.tooltip_content = el.find('.tooltip_content');
			this.transition_timeout = 300;

			this.bindEvents();
		},
		bindEvents: function() {
			this.tooltip.hover($.proxy(this.hover_in, this), $.proxy(this.hover_out, this));
		},
		hover_in: function(){
			this.tooltip_content.stop(true, true).fadeIn(this.transition_timeout);
		},
		hover_out: function() {
			this.tooltip_content.fadeOut(this.transition_timeout);
		}
	};

	$(document).ready(function(){
		$('.tooltip').each(function(){
			var instance = Object.create( PointerEventsPolyfill );
			instance.init($(this));
		});
	});

})(jQuery);