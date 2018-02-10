var keyboards = 15;

	/* ADD KEYBOARDS TO CANVAS */

	for (var i = 0; i < keyboards; i++) {

		$('#canvas').append('<div class="keyboard keyboard' + i + '"></div>');
	}


	/* KEYS AND VALUES */

	var keys = [
		"1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
		"q", "w", "e", "r", "t", "y", "u", "i", "o", "p",
		"a", "s", "d", "f", "g", "h", "j", "k", "l", "ò",
		"z", "x", "c", "v", "b", "n", "m", ",", ".", "-"
	]

	/* ADD KEYS TO KEYBOARDS */

	for (var i = 0; i < keys.length; i++) {
		$('.keyboard').append('<div class="key key-' + keys[i] + '"><span>'+ keys[i] +'</span></div>');
	}

	$('.key-0, .key-p, .key-ò').after('<br/>');

	/* TOGGLE WHITE ON PRESS */

	$(document).keydown(function(e){

		for (var i = 0; i < keys.length; i++) {
			if ( e.key == keys[i] ) {
				$('.active .key-'+keys[i]).toggleClass('on');
			}
		}

	});

	/* ACTIVE KEYBOARD */

	var activeKeyboard = 0;
	$('.keyboard' + activeKeyboard).addClass('active');

	/* OTHER KEYPRESSES */

	$(document).keydown(function(e){

		/* CYCLE KEYBOARDS */

		if ( e.key == 'Shift' ) { 

			if (activeKeyboard < keyboards-1) {
				activeKeyboard++; } else { activeKeyboard = 0 }

				$('.keyboard').removeClass('active');
				$('.keyboard' + activeKeyboard).addClass('active');

			}

			/* CLEAR */

			if ( e.key == ' ' ) {

				$('.key').removeClass('on'); 

			}

			/* SHOW/HIDE */

			if ( e.key == 'Control' ) {

				$('#canvas').toggleClass('show');

			}

		});