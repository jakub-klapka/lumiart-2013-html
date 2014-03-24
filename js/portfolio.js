/* global jQuery, Handlebars, addthis */
(function($){
	var CSSConfig = {
		pagination_fade_timeout: 300,
		space_between_columns_desktop: 0.04, //%
		space_between_columns_tablet: 0.06, //%
		lumi_box_corners_offset: 15 //px
	};

	var LumiPortfolioPaginationAndIndication = {

		init: function() {
			this.list = $('.portfolio_list');
			this.pagination = $('.portfolio_list_pagination');
			this.lis = this.list.find('li');
			this.number_of_visible = 3;
			this.number_of_pages = Math.ceil( this.lis.length / this.number_of_visible );
			this.active_page = 1;

			this.next_button = this.pagination.find('.next');
			this.prev_button = this.pagination.find('.prev');
			this.pagination_counter_current = this.pagination.find('.page .current');

			this.window = $(window);
			this.page_wrap = $('.page_wrap');
			this.indicator_list = $('.portfolio_list_indicator');
			this.article_indicator = $('.article_active_indicator');
			this.connect_link = this.indicator_list.find('.connect_link');

			this.initial_hash = ( window.location.hash ) ? true : false;

			this.correct_indicator_after_width();
			this.setIndicatorTop();

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

			/*
			Correct conector link and correct top on indicator
			 */
			this.window.on('resize', function(){
				self.correct_indicator_after_width();
				self.setIndicatorTop();
			});


		},
		changePage: function( target ) {

			var self = this;
			//hide visible pages
			var old_ones = this.lis.filter('.visible');
			old_ones.fadeOut(CSSConfig.pagination_fade_timeout, function(){

				old_ones.removeClass('visible');
				//show new ones
				var start = ( target - 1 ) * self.number_of_visible,
					end = start + self.number_of_visible;
				var new_ones = self.lis.slice(start, end);
				new_ones.fadeIn(CSSConfig.pagination_fade_timeout, function(){
					//after fade in finishes
					new_ones.addClass('visible');

					//if hash exists, there is possible active item on not-1 page, we have to correct top of indicator again
					if( self.initial_hash ){
						if ( self.checkShowHideIndicators( false, true ) ) {
							self.setIndicatorTop();
						}
					}
				});

				//set new variables
				self.active_page = target;

				//change active button
				self.pagination_counter_current.html(self.active_page);

			});

			//check for hiding indicators
			this.checkShowHideIndicators( target );

		},
		correct_indicator_after_width: function() {
			if( window.lumi_responsive_current === 'mobile' ) { return; } //don't process anything on mobile

			var gutter = ( window.lumi_responsive_current === 'desktop' ) ? CSSConfig.space_between_columns_desktop : CSSConfig.space_between_columns_tablet,
				window_width = this.page_wrap.width(),
				corrected_width = ( window_width * gutter ) - ( CSSConfig.lumi_box_corners_offset * 2 ); //4% gutter between lumi boxes and 15px on each border
			this.connect_link.width( corrected_width );

		},
		setIndicatorTop: function() {
			if( window.lumi_responsive_current === 'mobile' ) { return; } //don't process anything on mobile

			var active_li = this.lis.filter('.active'),
				active_offset = active_li.position();
			this.indicator_list.css('top', active_offset.top );
		},
		checkShowHideIndicators: function( target_page, return_on_current_page ) {
			target_page = ( target_page ) ? target_page : this.active_page;
			var active_position = this.lis.index( this.lis.filter('.active') ) + 1,
				on_current_page;
			if ( active_position > ( target_page - 1 ) * this.number_of_visible && active_position <= target_page * this.number_of_visible ) {
				on_current_page = true;
			} else {
				on_current_page = false;
			}
			if( return_on_current_page ){
				//function was called just to figure out, if we are on page with active
				return on_current_page;
			}
			if( on_current_page ) {
				this.indicator_list.add( this.article_indicator ).removeClass('list_hidden');
			} else {
				this.indicator_list.add( this.article_indicator ).addClass('list_hidden');
			}

		},
		switchActive: function( new_active ) {
			new_active = $(new_active);
			this.lis.filter('.active').removeClass('active');
			new_active.parent( 'li').addClass('active');
			this.checkShowHideIndicators();
			this.setIndicatorTop();
		}

	};

	var LumiPortfolioSwitching = {
		init: function( pagination_instance ) {
			this.pagination_instance = pagination_instance;
			this.client_content = $('.portfolio_client_content');
			this.template_file = this.client_content.data('hb-template-name');
			this.list = $('.portfolio_list');

			this.bindEvents();
			this.checkForHash();
		},
		bindEvents: function() {
			var bind_anchors = function(evt) {
				evt.preventDefault();
				var $this = $(this);
				self.loadClient( $this.attr('href'), $(this), $this.data('slug') );
			};

			var self = this;
			if( window.lumi_responsive_current !== 'mobile' ) {
				this.list.on('click.portfolio_switching', 'a', bind_anchors);
			}
			$(document).on( 'lumi_responsive_change', function( data ){
				if( data.new_width === 'mobile' ) {
					self.list.off('click.portfolio_switching');
				}
				if( data.old_width === 'mobile' ) {
					self.list.on('click.portfolio_switching', 'a', bind_anchors);
				}
			});
		},
		checkForHash: function() {
			var hash = window.location.hash;
			if( hash ) {


				hash = hash.substr(1);//remove bang
				var target_anchor = this.list.find('a').filter('[data-slug=' + hash + ']');
				if( target_anchor.length > 0 ) {
					//anchor with that hash really exists

					//on mobile redirect right away, but just on first load
					if( window.lumi_responsive_current === 'mobile' ) {
						window.location = target_anchor.attr('href');
						return;
					}

					//otherwise load client in normal way
					this.loadClient( target_anchor.attr('href'), target_anchor, target_anchor.data('slug') );
				}
			}
		},
		loadClient: function( href, element, slug ) {
			this.showHidePreloader( 'show', element );
			var xhr = $.ajax({
				dataType: 'json',
				url: href + 'json/'
			});
			var self = this;
			xhr.done(function(data){
				//done loading
				self.processTemplate(data);

				//visually change active
				self.pagination_instance.switchActive( element );
				self.showHidePreloader( 'hide', element );

				//change hashtag
				window.location.hash = slug;
			});
			xhr.fail(function(){
				alert('Něco nezafungovalo správně, portfolio se otevře v nouzovém režimu a moc nám pomůžete, pokud nám o tom napíšete.');
				window.location = href;
			});
		},
		/*
		@param string show|hide
		 */
		showHidePreloader: function( type, element ) {
			var current_preloader = element.find('.preloader');
			if( type === 'show' ) {
				current_preloader.addClass('active');
			} else {
				current_preloader.removeClass('active');
			}
		},
		processTemplate: function( data ) {
			var new_html = Handlebars.templates[this.template_file]( data ),
				self = this;
			this.client_content.fadeOut( CSSConfig.pagination_fade_timeout, function() {
				//fadeout complete
				self.client_content.html( new_html).fadeIn( CSSConfig.pagination_fade_timeout );

				self.functionsOnNewDomReady();
			});
		},
		functionsOnNewDomReady: function() {
			//reload picturefilled images
			if (typeof window.picturefill === 'function') {
				window.picturefill();
			}

			//reload addthis toolbox
			if ( typeof addthis !== 'undefined' && typeof addthis.toolbox === 'function') {
				addthis.toolbox('#addthis_toolbox');
				addthis.counter("#atcounter");
			}

			//Brace headings
			$.event.trigger('lumiart_portfolio_change_loaded');

		}
	};

	$(document).ready(function(){
		var pagination_instance = Object.create( LumiPortfolioPaginationAndIndication );
		pagination_instance.init();
		LumiPortfolioSwitching.init( pagination_instance );
	});

})(jQuery);