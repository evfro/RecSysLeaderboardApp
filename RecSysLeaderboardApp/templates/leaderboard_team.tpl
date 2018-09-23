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
	<div class="scores-container">
	<form class="keep-together" id="output-form-metrics">
	<label>Metrics:</label><br/>
		<ul class="recommendations">
		%for name, recall, ndcg, ndcl in scores:
		<li class="new-item">{{name}} &emsp; Recall: {{recall}} &emsp; nDCG: {{ndcg}} &emsp; nDCL: {{ndcl}}</li>
		%end
		</ul>
	</form>

	<form class="keep-together" id="output-form-score">
	<label>Total score:</label><br/>
		<ul class="recommendations">
		%for name, score in total:
		<li class="new-item">{{name}} &emsp; &emsp; Combined score: {{score}}</li>
		%end
		</ul>
	</form>

	</div>
</div>

<script src="static/js/jquery-1.8.2.min.js"></script>
<script src="static/js/modernizr-1.5.min.js"></script>
<script src="static/js/scripts.js"></script>

</body>
</html>