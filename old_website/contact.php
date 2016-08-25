<!-- 
Page Name: contact.php
Page Type: Controller Page
Developer: Fareez Ahmed
Page Description: This page manage the contact views and operations 
-->

<?php
// Current Active Page Name Variable
$current_page_name = "contact";

// Page Name Variable
$page_name = "Contact Us";

// Page View
require 'views/contact_view.php';

if ( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

	$subject = htmlspecialchars($_POST['fname']."-".$_POST['email']."-".$_POST['subject']);
	$message = htmlspecialchars($_POST['message']);

	$mail_status = mail('fareez1234@gmail.com', $subject, $message);

	if($mail_status == 1 && !empty($mail_status)){
		$mail_info_class = "alert-success";
		$mail_message ="Your message has been send. Thanks You!";
		include "views/alert_view.php";
		include "js/contact.js";
	}else{
		$mail_info_class = "alert-error";
		$mail_message ="Oops!! Sorry, your message was not send sucessful. Try Again Later!";
		include "views/alert_view.php";
		include "js/contact.js";
	}

}


?>