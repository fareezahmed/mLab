<?php 
session_start();

$page_name = "Login";


require "helperFunction.php";

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
	// get their values
	$username = $_POST['username'];
	$password = $_POST['password'];

	// validate that against the records
	// Viewer: Can this be abstracted away to a reusable function?
	if (validate($username, $password)) {
		// credentials are correct

		// login + set session
		$_SESSION['username'] = $username;
		header("Location: blog.php");
	} else {
		$mail_info_class = "alert-error";
		$mail_message ="Invalid Username or Password. Try Again Later!";
		include (__DIR__ . '/js/error.js');
		include (__DIR__ . '/view/alert_view.php');
	}
}

require "view/index_view.php";

?>