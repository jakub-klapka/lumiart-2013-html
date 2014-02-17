/* global jQuery, Modernizr */
(function($){

	/*
	Test for pointer events support and load polyfill
	 */
	if( !Modernizr.pointerevents ) {
		$.getScript( window.root_url + 'js/contact-no-pointerevents.min.js' );
	}

	//textarea
	$(document).ready(function(){
		$('.contact_form textarea').autosize({append: "\n"});
	});

	/*
	Validation on blur only - rest is done via ajax and CF7
	 */

	var LumiContactValidation = {
		init: function(elem) {
			this.form = $(elem);
			this.inputs = this.form.find('.form_input_text input[type!=input], textarea');
			this.submit = this.form.find('input[type=submit]');

			this.bindEvents();
		},
		bindEvents: function() {
			var self = this;
			this.inputs.on('blur', function(){
				self.validate($(this));
				//self.checkSubmitDisable();
			});
			this.form.on('submit', function(e){
				self.checkOnSubmit(e);
			});
		},
		validate: function(elem) {
			//validate required
			if( elem.hasClass('required') ) {
				if( elem.val() === '' ) {
					this.setValidation( elem, 'invalid' );
					return;
				}
			}

			//validate email
			if( elem.attr( 'type' ) === 'email' ) {
				var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/,
					value = elem.val();
				if( !regex.test( value ) ) {
					this.setValidation( elem, 'invalid' );
					return;
				}
			}

			//if value not required, don't do any indications
			/*if( !elem.hasClass('required') ) {
				this.setValidation(elem, 'neutral');
				return;
			}*/

			//passes all tests
			this.setValidation( elem, 'valid' );
		},
		setValidation: function(elem, type) {
			if( type === 'invalid' ) {
				elem.closest('.form_input_text').removeClass('valid').addClass('not_valid');
			} else if( type === 'valid' ) {
				elem.closest('.form_input_text').removeClass('not_valid').addClass('valid');
			} else {
				elem.closest('.form_input_text').removeClass('not_valid').removeClass('valid');
			}
		},
		checkOnSubmit: function(submit_event) {
			var self = this;
			this.inputs.each(function(){
				self.validate( $(this) );
			});
			if( this.form.find('.not_valid').length > 0 ) {
				//we have some invalid elements
				submit_event.preventDefault();
			}
		}
	};

	$(document).ready(function() {
		$('.contact_form').each(function() {
			var instance = Object.create( LumiContactValidation );
			instance.init(this);
		});
	});

	/*
	HIRE US HIDING
	 */
	var HireUsHiding = {
		init: function() {
			this.form = $('.contact_form:first');
			this.general_question = this.form.find('input[data-hide-general-question]');
			this.hire_us = this.form.find('input[data-hide-hire-us]');
			this.hire_questions = this.form.find('.hire_us');
			this.hire_labels = this.hire_questions.find('.form_input_text label, .radio_label');
			this.transition_timeout = 300;

			this.bindEvents();
		},
		bindEvents: function() {
			//change on general question
			var self = this;
			this.general_question.on('change', function() {
				var checked = self.general_question.is(':checked');
				if( checked ) {
					self.hideIt();
				}
			});

			this.hire_us.on('change', function() {
				var checked = self.hire_us.is(':checked');
				if( checked ) {
					self.showIt();
				}
			});
		},

		showIt: function() {
			if( window.lumi_responsive_current === 'desktop' ) {
				//on desktop, labels are behind overflow - thus there is little save by fading them afterwards
				this.hire_labels.hide();
				var self = this;
				this.hire_questions.slideDown(this.transition_timeout, function(){
					self.hire_labels.fadeIn( self.transition_timeout );
				});
			} else {
				this.hire_questions.slideDown(this.transition_timeout);
			}
		},

		hideIt: function() {
			if( window.lumi_responsive_current === 'desktop' ) {
				var self = this;
				this.hire_labels.fadeOut(this.transition_timeout, function(){
					self.hire_questions.slideUp(self.transition_timeout, function() {
						self.hire_labels.show(); //even if they are hidden, let them show for subsequent cycles on mobile
					});
				});
			} else {
				this.hire_questions.slideUp(this.transition_timeout);
			}
		}
	};

	$(document).ready(function(){
		HireUsHiding.init();
	});

})(jQuery);