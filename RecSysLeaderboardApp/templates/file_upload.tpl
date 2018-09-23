<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>Upload your file</title>

	<link rel="icon" href="data:;base64,iVBORw0KGgo=">
</head>

<body>
<div class="demo-wrapper">
<div class="reminder-container">
	<form id="input-form" action="/upload" method="post" enctype="multipart/form-data">
	  <label>Select a file:</label><br/>
	  <input type="file" name="upload" />
	  <input type="submit" value="Upload" />
	</form>
</div>
</div>

</body>
</html>