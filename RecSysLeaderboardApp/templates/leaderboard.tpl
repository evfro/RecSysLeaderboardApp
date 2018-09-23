<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>Leaderboard</title>

    <link rel="stylesheet" href="static/css/styles.css" />
    <link rel="stylesheet" href="static/css/styles-4.css" />
	<link rel="icon" href="data:;base64,iVBORw0KGgo=">
</head>

<body>
<div class="demo-wrapper">
	<header>
		<h1>Leaderboard:</h1>
	</header>
	<div align="center">
	<font color="orange" size="5">Try to get to the top of the leaderboard!</font>
	</div>
	<div class="reminder-container">
		<ul class="reminders">
		%for name, score in scores:
		<li class="new-item">{{name}} ({{score}})</li>
		%end
		</ul>
	</div>
</div>

<script src="static/js/jquery-1.8.2.min.js"></script>
<script src="static/js/modernizr-1.5.min.js"></script>
<script src="static/js/scripts.js"></script>

</body>
</html>