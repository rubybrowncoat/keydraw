<template>
	<router-view></router-view>
</template>

<style lang="scss">
html, body {
	margin: 0;
}

html {
	box-sizing: border-box;
}
*, *:before, *:after {
	box-sizing: inherit;
}

#wrapper {

	margin: 0;
	padding: 0;
	height: 200vh;

	&.dark {
		color: #FFFFFF;
		background-color: #444444;
		font-family: 'VT323';
		& a {
			color: #fff;
			text-decoration: none;
		}
	}

	&.paper {
		color: #000000;
		background-color: #FFFCED;
		font-family: 'Amiri';
		& a {
			color: #000;
			text-decoration: none;
		}
	}
}


</style>


<script>
export default {
	name: 'KeyDraw',
}
</script>
