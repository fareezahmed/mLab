<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<html lang="en" class="no-js">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>MoonLab: Design you are business today</title>
		<meta name="description" content="We build, website and online services for all business needs" />
		<meta name="keywords" content="online business, ecommerics, web development, web design" />
		<meta name="author" content="Fareez Ahmed" />
		<!-- Bootstrap -->
		<script src="js/modernizr.custom.js"></script>
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/jquery.fancybox.css" rel="stylesheet">
		<link href="css/flickity.css" rel="stylesheet" >
		<link href="css/animate.css" rel="stylesheet">
		<link href="http://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
		<link href='http://fonts.googleapis.com/css?family=Nunito:400,300,700' rel='stylesheet' type='text/css'>
		<link href="css/styles.css" rel="stylesheet">
		<link href="css/queries.css" rel="stylesheet">
		<!-- Facebook and Twitter integration -->
		<meta property="og:title" content=""/>
		<meta property="og:image" content=""/>
		<meta property="og:url" content=""/>
		<meta property="og:site_name" content=""/>
		<meta property="og:description" content=""/>
		<meta name="twitter:title" content="" />
		<meta name="twitter:image" content="" />
		<meta name="twitter:url" content="" />
		<meta name="twitter:card" content="" />
		
		<link rel="icon" type="image/gif" href="img/logo-icon.gif" />
		<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
		<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
		<script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body class="apform">
		<!--[if lt IE 7]>
		<p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
		<![endif]-->
		<!-- open/close -->
		<header>
			<section>
				<div class="container">
					<div class="row nav-wrapper">
						<div class="col-md-6 col-sm-6 col-xs-6 text-left">
							<a class="logo" href="#">M<img src="img/logo-sm.png" alt="MoonLab Logo">nLab</a>
						</div>
						<div class="col-md-6 col-sm-6 col-xs-6 text-right navicon">
							<a class="nav_slide_button nav-toggle" href="index.html">Back To Home</a>
						</div>
					</div>
				</div>
				<!-- Code for Scroll to Top -->
				<a href="#" class="scrollup">Scroll</a>
				<!-- End Code for Scroll to Top -->
			</section>
		</header>

		<section class="application">
			<div class="container-fluid">
				<h1>Application Form</h1>
				<form>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
							    <label for="fullName">Contact Name</label>
							    <input type="text" class="form-control" id="fullName" placeholder="Full Name..">
							 </div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
							    <label for="Email">Email Address</label>
							    <input type="email" class="form-control" id="Email" placeholder="Email...">
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
							    <label for="CompName">Company Name</label>
							    <input type="text" class="form-control" id="CompName" placeholder="Company Name...">
							 </div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12">
							<div class="form-group">
							    <label for="CompDesc">Company Description</label>
							    <textarea id="CompDesc" class="form-control" rows="2" placeholder="Company Description..."></textarea>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-8">
							<div class="form-group">
							    <label for="DomainName">Domain/Website Name</label>
							    <input type="text" class="form-control" id="DomainName" placeholder="Domain Name..">
							 </div>
						</div>
						<div class="col-md-4">
							<div class="form-group">
							    <label for="DomainName">Number Sections/Pages</label>
							    <input type="number" class="form-control" id="DomainName" >
							 </div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-6">
							<div class="form-group">
							    <label>Do you have a Domain Name ?</label>
							    <div class="radio">
								  <label>
								    <input type="radio" name="optionsRadios" id="optionsRadios1" value="yes" >
								  	Yes
								  </label>
								</div>
								<div class="radio">
								  <label>
								    <input type="radio" name="optionsRadios" id="optionsRadios2" value="no">
								    No
								  </label>
								</div>
							 </div>
						</div>
						<div class="col-md-6">
							<div class="form-group">
							    <label>Do you have Web Hosting ?</label>
							    <div class="radio">
								  <label>
								    <input type="radio" name="optionsRadios" id="optionsRadios1" value="yes" >
								  	Yes
								  </label>
								</div>
								<div class="radio">
								  <label>
								    <input type="radio" name="optionsRadios" id="optionsRadios2" value="no">
								    No
								  </label>
								</div>
							 </div>
						</div>
					</div>
					<div class="row temp">
					<?php include 'template.php'; ?>
					</div>
				</form>
			</div>
		</section>
		
		<section class="screenshots" id="screenshots">
			<div class="container-fluid">
				<div class="row">
					<ul class="grid">
						<li>
							<figure>
								<img src="img/01-screenshot.jpg" alt="Screenshot 01">
								<figcaption>
								<div class="caption-content">
									<a href="#" class="single_image">
										<!-- <i class="fa fa-search"></i><br> -->
										<p>Optimised For Design</p>
									</a>
								</div>
								</figcaption>
							</figure>
						</li>
						<li>
							<figure>
								<img src="img/02-screenshot.jpg" alt="Screenshot 01">
								<figcaption>
								<div class="caption-content">
									<a href="#" class="single_image">
										<!-- <i class="fa fa-search"></i><br> -->
										<p>User Centric Design</p>
									</a>
								</div>
								</figcaption>
							</figure>
						</li>
						<li>
							<figure>
								<img src="img/03-screenshot.jpg" alt="Screenshot 01">
								<figcaption>
								<div class="caption-content">
									<a href="#" class="single_image">
										<!-- <i class="fa fa-search"></i><br> -->
										<p>Responsive and Adaptive</p>
									</a>
								</div>
								</figcaption>
							</figure>
						</li>
						<li>
							<figure>
								<img src="img/04-screenshot.jpg" alt="Screenshot 01">
								<figcaption>
								<div class="caption-content">
									<a href="#" class="single_image">
										<!-- <i class="fa fa-search"></i><br> -->
										<p>Multi-Purpose Design</p>
									</a>
								</div>
								</figcaption>
							</figure>
						</li>
					</ul>
				</div>
			</div>
		</section>
		
		<footer>
			<div class="container">
				<div class="row">
					<div class="col-md-5">
						<a class="footer-logo logo">
						M<img src="img/logo-sm.png" alt="Footer Logo">nLab
						</a>
						<p>© MoonLab 2015 - Designed &amp; Developed by <a href="http://www.fareezahmed.com/">Fareez Ahmed</a></p>
					</div>
					<div class="col-md-7">
						<ul class="footer-nav">
							<li><a href="#about">About</a></li>
							<li><a href="#features">Services</a></li>
							<li><a href="#work">Our Work</a></li>
							<li><a href="#download">Contact</a></li>
						</ul>
					</div>
				</div>
			</div>
		</footer>
		<div class="overlay overlay-boxify">
			<nav>
				<ul>
					<li><a href="#about"><i class="fa fa-users"></i>About</a></li>
					<li><a href="#features"><i class="fa fa-cog"></i>Services</a></li>
				</ul>
				<ul>
					<li><a href="#work"><i class="fa fa-trophy"></i>Our Work</a></li>
					<li><a href="#download"><i class="fa fa-comments"></i>Contact</a></li>
				</ul>
			</nav>
		</div>

		<div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
		  <div class="modal-dialog modal-lg">
		    <div class="modal-content">
		      <div class="modal-header">
		        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
		        <h2 class="modal-title">Contact Us</h2>
		      </div>
		      <div class="modal-body">
		        	<form id="form">
		        		<div class="loading-section">
		        			<div class="sk-folding-cube">
						  		<div class="sk-cube1 sk-cube"></div>
						  		<div class="sk-cube2 sk-cube"></div>
						  		<div class="sk-cube4 sk-cube"></div>
						  		<div class="sk-cube3 sk-cube"></div>
							</div>
		        		</div>

						<p id="returnmessage" ></p>
						<div class="col-xs-6 no-left-padding">
							<label>Name: <span class="rq">*</span></label>
							<input type="text" id="contactName" class="form-control" placeholder="Full Name"/>
						</div>
						<div class="col-xs-6">
							<label>Contact No: <span class="rq">*</span></label>
							<input type="text" id="contactNo" class="form-control" placeholder="Enter the full Mobile No with country code."/>
						</div>
	
						<label>Email: <span class="rq">*</span></label>
						<input type="text" id="email" class="form-control" placeholder="Email"/>
						<label>Message:</label>
						<textarea id="message" rows="4" class="form-control last" placeholder="Message......."></textarea>

	<!-- 					<input type="button" id="reset" class="btn btn-default" value="Reset"/>
						<input type="button" id="submit" class="btn btn-primary" value="Send Message"/> -->

					</form>
					<div class="clearfix"></div>
		      </div>
		      <div class="modal-footer">
		        <button type="button" id="reset" class="btn btn-default" data-dismiss="modal">Close</button>
		        <button type="button" id="submit" class="btn btn-primary">Save changes</button>
		      </div>
		    </div><!-- /.modal-content -->
		  </div><!-- /.modal-dialog -->
		</div><!-- /.modal -->

		<!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
		<script src="js/min/toucheffects-min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
		<script src="js/flickity.pkgd.min.js"></script>
		<script src="js/jquery.fancybox.pack.js"></script>
		<!-- Include all compiled plugins (below), or include individual files as needed -->
		<script src="js/retina.js"></script>
		<script src="js/waypoints.min.js"></script>
		<script src="js/bootstrap.min.js"></script>
		<script src="js/min/scripts-min.js"></script>
		<script>	
			$(document).ready(function() {
				$(".loading-section").hide();
				$("#submit").click(function() {
				var conName = $("#contactName").val();
				var email = $("#email").val();
				var message = $("#message").val();
				var contact = $("#contactNo").val();
				$(".loading-section").show();
				$("#returnmessage").empty(); // To empty previous error/success message.
				// Checking for blank fields.
				if (conName == '' || email == '' || contact == '') {
				alert("Please Fill Required Fields");
				} else {
				// Returns successful data submission message when the entered information is stored in database.
				$.post("contact_form.php", {
				name1: conName,
				email1: email,
				message1: message,
				contact1: contact
				}, function(data) {
				$("#returnmessage").append(data); // Append returned message to message paragraph.
				$(".loading-section").hide();
				if (data == "has been received, We will contact you soon.") {
				$("#form")[0].reset(); // To reset form fields on success.
				}
				});
				}
				});
			});
		</script>
		<!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
		<script>
		(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
		function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
		e=o.createElement(i);r=o.getElementsByTagName(i)[0];
		e.src='//www.google-analytics.com/analytics.js';
		r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
		ga('create','UA-XXXXX-X');ga('send','pageview');
		</script>
	</body>
</html>
