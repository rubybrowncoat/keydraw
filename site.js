var keyboards = 21;

	/* ADD KEYBOARDS TO CANVAS */

	for (var i = 0; i < keyboards; i++) {

		$('#canvas').append('<div class="keyboard keyboard' + i + '"></div>');
	}


	/* KEYS AND VALUES */

	var keys = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 65, 83, 68, 70, 71, 72, 74, 75, 76, 186, 90, 88, 67, 86, 66, 78, 77, 188, 190, 189]
	var keyvalues = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "&ograve;", "z", "x", "c", "v", "b", "n", "m", ",", ".", "-"]


	/* ADD KEYS TO KEYBOARDS */

	for (var i = 0; i < keys.length; i++) {
		$('.keyboard').append('<div class="key key-' + keys[i] + '"><span>'+ keyvalues[i] +'</span></div>');
	}

	$('.key-48, .key-80, .key-186').after('<br/>');

	/* TOGGLE WHITE ON PRESS */

	$(document).keydown(function(event){

		for (var i = 0; i < keys.length; i++) {

			if ( event.which == keys[i] ) $('.active .key-'+keys[i]).toggleClass('on');
		}

	});

	/* ACTIVE KEYBOARD */

	var activeKeyboard = 0;
	$('.keyboard' + activeKeyboard).addClass('active');

	/* OTHER KEYPRESSES */

	$(document).keydown(function(event){

		/* CYCLE KEYBOARDS */

		if ( event.which == 16 ) { 

			if (activeKeyboard < keyboards-1) {
				activeKeyboard++; } else { activeKeyboard = 0 }

				$('.keyboard').removeClass('active');
				$('.keyboard' + activeKeyboard).addClass('active');

			}

			/* CLEAR */

			if ( event.which == 32 ) {

				$('.key').removeClass('on'); 

			}

			/* SHOW/HIDE */

			if ( event.which == 17 ) {

				$('#canvas').toggleClass('show');

			}

		});