/* global jQuery */
(function($){

	var Team = {

		init: function() {
			this.people = false; //for performance will be populated later
			this.shuffle = Math.round(Math.random()); //1 or 0

			if( this.shuffle === 1 ) {
				this.shufflePeople();
			}
		},

		shufflePeople: function(){
			this.people = $('.main_content .lumi_box');
			var first = this.people.eq(0),
				second = this.people.eq(1);
			second.insertBefore(first);
		}

	};

	$(document).ready(function(){
		Team.init();
	});

})(jQuery);