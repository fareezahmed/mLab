<?php 
// require "users/user.php";
// require "modal/database.php.php";

require (__DIR__ . '/users/user.php');
require (__DIR__ . '/modal/database.php');

function validate($username, $password){
	$user = new User(getcwd()."/users/user_list.txt");
	return md5($password) == $user->get_user_password($username) ? true :false;
}

function display_Blogs($tablename){
	$database = new Database();
	$data_link = $database->connect_database();
	$dataSet =  $database->fetch_all($data_link, $tablename);
	$ouput = "";
	foreach ($dataSet as $data) {
		extract($data);
// Using Heredoc technique to formate data
$ouput .=  <<<EOT
	<form role="form" action="" method="POST">
		<input type="text" class="sr-only" id="id" name="id" value="{$id}">
        <button type="submit" class="btn btn-danger pull-right" name="postDelete">Delete</button>
    </form>
	<h2>$title</h2>
	<p class="author">Post Author: Fareez Ahmed</p>
	<p class="postBody">$body<p>
	<hr>
	<br>
EOT;
	}

	return $ouput;
}

function updatePost($row_data,$table_name){
	$database = new Database();
	$data_link = $database->connect_database();
	return $database->insert_row($row_data, $data_link, $table_name)? true : false;
}

function deletePost($id,$table_name){
	$database = new Database();
	$data_link = $database->connect_database();
	return $database->delete_row_by_id($id, $data_link, $table_name)? true : false;
}

?>