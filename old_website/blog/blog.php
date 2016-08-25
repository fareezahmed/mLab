<?php 
session_start();

if ( !isset($_SESSION['username']) ) {
	header('Location: index.php');
	die();
}


require "helperFunction.php";

$username = $_SESSION['username'];
$page_name = "Blog";
$table_name = "blog";

if ( isset($_POST['postSumit'])) {

	// get their values
	$postData = array(
		'title' => $_POST['title'], 
		'body' => $_POST['body']
		);

	if(updatePost($postData,$table_name)){
		$mail_info_class = "alert-success";
		$mail_message ="Your message has been Posted. Thanks You!";
		include (__DIR__ . '/view/alert_view.php');
	}else{
		$mail_info_class = "alert-error";
		$mail_message ="Oops!! Sorry, your message was not posted sucessful. Try Again Later!";
		include (__DIR__ . '/view/alert_view.php');
	}
}

if ( isset($_POST['postDelete'])) {

	if(deletePost($_POST['id'],$table_name)){
		$mail_info_class = "alert-success";
		$mail_message ="The post was deleted sucessful. Thanks You!";
		include (__DIR__ . '/view/alert_view.php');
	}else{
		$mail_info_class = "alert-error";
		$mail_message ="Oops!! Sorry, your posted was not deleted. Try Again Later!";
		include (__DIR__ . '/view/alert_view.php');
	}
}

$blog_list = display_Blogs($table_name);

require "view/blog_view.php";

?>