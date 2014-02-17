/* global jQuery, Modernizr */
(function($){

	/*
	Load polyfills before anything else
	 */
	if( !Modernizr.mq('only all') ) {
		$.ajax({
			url: window.root_url + 'js/polyfills/respond.min.js',
			dataType: "script",
			async: false
		});
	}


	/*
	PARALAX SCROLL
	TODO: add detection for position fixed
	 */
	var ParalaxScroll = {
		config: {
			multiplier: 0.2 //how much will be scrolling slower (lower -> slower)
		},
		init: function() {
			this.body = $('html');
			this.bg_position_x = this.body.css('background-position').split(" ")[0];
			this.window = $(window);

			//add transition proerty to body element, we need to do this via JS, to have right initial value
			this.body.css('transition-property', 'background-position-x');

			this.bindEvents();
		},
		bindEvents: function() {
			var self = this;
			this.window.on('scroll.ParalaxScroll', function() {
				var window_scroll = self.window.scrollTop(),
					bg_position_y = -window_scroll * self.config.multiplier,
					bg_position_css = self.bg_position_x + ' ' + bg_position_y + 'px';
				self.body.css('background-position', bg_position_css);
			});
		},
		destroy: function() {
			this.body.css('transition-property', 'none');
			this.window.off('scroll.ParalaxScroll');
			this.body.attr('style', '');
		}
	};


	/*
	LOGO FONT RESIZING
	 */
	var LogoFontFit = {
		config: {
			container: '.main_header .logo',
			element: 'span'
		},
		init: function() {
			this.container = $(this.config.container);
			this.element = this.container.find(this.config.element);
			this.window = $(window);

			this.fitText();
			this.bindEvents();
		},
		fitText: function( reset ) {
			//reset - reset font size
			if( reset ) {
				this.container.css('font-size', 'inherit');
			}
			var container_width = this.container.width(),
				element_width = this.element.width(),
				element_font_size = parseFloat( this.element.css('font-size') );
			var multiplier = container_width / element_width;
			this.container.css('font-size', element_font_size * multiplier * 0.96); //0.96 - compensate for some glitches
		},
		bindEvents: function() {
			var self = this;
			this.window.on('resize.logo_font_fit', function() {
				self.fitText( true );
			});
		},
		destroy: function() {
			var self = this;
			this.window.off('resize.logo_font_fit');
			this.window.on('resize.reset_logo', function() {
				self.container.attr('style', '');
				self.window.off('resize.reset_logo');
			});
		}
	};



	/*
	MENU OPENING
	 */
	var MenuOpening = {
		init: function() {
			//add button to dom
			this.button = $('.main_header .open_menu');
			this.menu = $('.main_menu');
			this.menu_open = false;
			this.html = $('html');
			this.body = $('body');
			this.window = $('window');

			this.menu.addClass('lumi_box');

			//ARIA menu is hidden at first
			this.menu.attr('aria-hidden', 'true');
			this.button.attr('aria-hidden', 'false');

			//bind click
			var self = this;
			this.button.on('click.MenuOpening', function(e){
				e.preventDefault();
				self.toggleMenu();
			});

			//bind swipes
			if( Modernizr.touch ) {

				$.getScript( window.root_url + 'js/jquery.mobile.custom.min.js').done(function(){
					//finished loading jq mobile

					//TODO android stock problem scrolling
					$.event.special.swipe.horizontalDistanceThreshold = 15;
					$(window).on('swipeleft.Lumi_menu_open', function() {
						if( self.menu_open === true ) {
							self.toggleMenu();
						}
					});

				});

			}

		},
		toggleMenu: function() {
			this.html.toggleClass('menu_open');
			this.button.toggleClass('active');
			this.toggleAria();
			//if opening menu -> scroll to top
			if( this.menu_open === false && this.window.scrollTop() !== 0 ) {
				this.body.animate({scrollTop: 0}, 1000);
				this.html.animate({scrollTop: 0}, 1000);
			}
			this.menu_open = !this.menu_open;
		},
		toggleAria: function() {
			if( this.button.attr('aria-pressed') === 'false' ) {
				this.button.attr('aria-pressed', 'true');
				this.menu.attr('aria-hidden', 'false');
			} else {
				this.button.attr('aria-pressed', 'false');
				this.menu.attr('aria-hidden', 'true');
			}
		},
		destroy: function() {
			this.button.off('click.MenuOpening');
			this.menu.attr('aria-hidden', 'false');
			this.menu_open = false;
			this.html.removeClass('menu_open');
			this.button.removeClass('active');
			this.button.attr('aria-hidden', 'true').attr('aria-pressed', 'false');
			this.menu.removeClass('lumi_box');
			if( Modernizr.touch ) {
				$(window).off('swipeleft.Lumi_menu_open');
			}
		}
	};


	/*
	BACK TO TOP BUTTON
	 */
	var BackToTop = {
		init: function() {
			this.elements = $('.back_to_top');

			this.elements.each(function() {
				$(this).on('click', function(){
					$('body').animate({scrollTop: 0}, 1000);
					$('html').animate({scrollTop: 0}, 1000);
				});
			});
		}
	};

	/*
	RESPONSIVE HANDLING
	 */
	var LumiResponsive = {
		config: {
			first_breakpoint: 767,
			second_breakpoint: 1024
		},
		init: function() {

			this.current = false;

			this.initialTest();

			//bind resize
			var self = this;
			$(window).resize(function() {
				self.onResize();
			});

		},
		test: function() {
			var is_mobile = Modernizr.mq('only screen and (max-width:' + this.config.first_breakpoint + 'px)'),
				is_tablet = Modernizr.mq('only screen and (min-width: ' + (this.config.first_breakpoint + 1) + 'px) and (max-width: ' + this.config.second_breakpoint + 'px)');
			if( is_mobile ) { return 'mobile'; }
			else if( is_tablet ) { return 'tablet'; }
			else { return 'desktop'; }
		},
		initialTest: function() {
			this.current = this.test();
			if( this.current === 'mobile' ){
				this.mobileOn();
				window.lumi_responsive_current = 'mobile';
			} else if( this.current === 'tablet' ) {
				this.tabletOn();
				window.lumi_responsive_current = 'tablet';
			} else {
				this.desktopOn();
				window.lumi_responsive_current = 'desktop';
			}
		},
		onResize: function() {
			var new_width = this.test();
			if( this.current !== new_width ) {
				//destroy old binds
				if( this.current === 'mobile' ) {
					this.mobileOff();
				} else if ( this.current === 'tablet' ) {
					this.tabletOff();
				} else {
					this.desktopOff();
				}

				//create new ones
				if( new_width === 'mobile' ) {
					this.mobileOn();
				} else if ( new_width === 'tablet' ) {
					this.tabletOn();
				} else {
					this.desktopOn();
				}

				//advise all plugins of change
				window.lumi_responsive_current = new_width;
				$.event.trigger({
					type: 'lumi_responsive_change',
					old_width: this.current,
					new_width: new_width
				});

				this.current = new_width;
			}
		},
		mobileOn: function() {

			//BIND MOBILE STUFF
			LogoFontFit.init();
			MenuOpening.init();

		},
		mobileOff: function() {

			MenuOpening.destroy();
			LogoFontFit.destroy();

		},
		tabletOn: function() {

			//BIND TABLET STUFF
			MenuOpening.init();

		},
		tabletOff: function() {

			MenuOpening.destroy();

		},
		desktopOn: function() {
			ParalaxScroll.init();
		},
		desktopOff: function() {
			ParalaxScroll.destroy();
		}
	};
	$(document).ready(function() {
		LumiResponsive.init();

		//Whole width functions:
		BackToTop.init();

	});


	/*
	Make lumi braces on headings
	 */
	var brace_headings = function() {
		$('.brace_it').each(function() {
			var $this = $(this),
				original = $this.html();
			var new_text = '&lt;' + original.replace(/ /g, '_') + '&gt;';
			$this.html( new_text );
		});
	};
	$(document).ready( brace_headings );
	$(document).on('lumiart_portfolio_change_loaded', brace_headings);


})(jQuery);