/*
 * jquery.rot13
 * https://github.com/kadamwhite/jquery.rot13
 *
 * Copyright (c) 2012 K.Adam White
 * Licensed under the MIT license.
 */

(function($) {

	var rot13 = function(str) {
		var chars = str.split('');
		return $.map(chars, function(ch) {
			var charCode;
			if(!ch.match(/[A-Za-z]/)) {
				return ch;
			}
			charCode = ch.charCodeAt(0);
			if(charCode < 97) {
				charCode = (charCode - 52) % 26 + 65;
			} else {
				charCode = (charCode - 84) % 26 + 97;
			}
			return String.fromCharCode(charCode);
		}).join('');
	};

	$(document).ready(function(){
		$('.email_decode').each(function(){
			var t = $(this);
			t.attr('href', rot13(t.attr('href')));
			t.text(rot13(t.text()));
		});
	});

}(jQuery));