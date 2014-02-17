/* global jQuery */
(function($){

	var LumiTestimonialsPagination = {

		init: function(element) {
			this.list = $(element);
			this.lis = this.list.find('li');
			this.number_of_visible = ( window.lumi_responsive_current === 'mobile' ) ? 1 : 2;
			this.number_of_pages = Math.ceil( this.lis.length / this.number_of_visible );
			this.active_page = 1;

			this.initial_dom_processing();

			this.bindEvents();
		},
		bindEvents: function() {

			var self = this;
			this.next_button.on('click.lumi_testimonials', function() {
				if( self.active_page < self.number_of_pages ) {
					self.changePage( self.active_page + 1 );
				}
			});
			this.prev_button.on('click.lumi_testimonials', function() {
				if( self.active_page > 1 ) {
					self.changePage( self.active_page - 1 );
				}
			});

		},
		initial_dom_processing: function() {

			//show visible ones
			this.lis.filter( ':lt(' + (this.number_of_visible) + ')').show().addClass('visible');

			//create pagiantion
			/*
			structure:
			<div class="testimonials_pagination">
				<button class="button prev">&lt;<div class="left_glow"></div><div class="right_glow"></div></button>
				<div class="page"><span class="current">1</span>&nbsp;/&nbsp;3</div>
				<button class="button next">&gt;<div class="left_glow"></div><div class="right_glow"></div></button>
			</div>
			*/
			var pagination = $('<div class="testimonials_pagination"></div>');
			this.prev_button = $('<button class="button prev">&lt;<div class="left_glow"></div><div class="right_glow"></div></button>');
			pagination.append(this.prev_button);

			var page_indicator = $('<div class="page"><span class="current">1</span>&nbsp;/&nbsp;' + this.number_of_pages + '</div>');
			this.pagination_current_page = page_indicator.find('.current');
			pagination.append( page_indicator );

			this.next_button = $('<button class="button next">&gt;<div class="left_glow"></div><div class="right_glow"></div></button>');
			pagination.append(this.next_button);

			//add pagination to DOM
			this.list.after( pagination );

		},
		changePage: function( target ) {

			var self = this;
			//hide visible pages
			this.lis.filter('.visible').removeClass('visible').fadeOut(300, function(){

				//show new ones
				var start = ( target - 1 ) * self.number_of_visible,
					end = start + self.number_of_visible;
				var new_ones = self.lis.slice(start, end);
				new_ones.addClass('visible').fadeIn(300);

				//change active page
				self.pagination_current_page.html(target);

				//set new variables
				self.active_page = target;

			});

		},
		destroy: function() {

			//unbind
			this.next_button.off('click.lumi_testimonials');
			this.prev_button.off('click.lumi_testimonials');

			//destroy DOM
			$('.testimonials_pagination').remove();

			//hide them initialy
			this.lis.hide();

			//remove present classes
			this.lis.removeClass('visible');

		}

	};

	$(document).ready(function(){

		$('.testimonials_list').each(function() {
			var instance = Object.create( LumiTestimonialsPagination );
			instance.init(this);

			var self = this;
			$(document).on('lumi_responsive_change', function() {
				instance.destroy();
				instance.init( self );
			});
		});



	});

})(jQuery);