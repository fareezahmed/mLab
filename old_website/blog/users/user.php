<?php

class User{

	private $base_file;

	function __construct($base_file) {
		$this->base_file = $base_file;
	}

	/**
     * This fetch the value of the password from users file
     *  Returns: String
     */
	public function get_user_password($username){
		$lines = $this->get_file_data();
		$line = $this->get_row_name($username,$lines);
		$dataSet = explode(",", $line);
		return $dataSet[1];
	}


	/**
     * This method is read all the line in user_list.txt file 
     *  Returns: Array containing all the lines
     */
	public function get_file_data(){
		return file_exists($this->base_file) ? file($this->base_file)
			: false;
	}

	/**
     * This method filters through the lines arrray and search for unique username
     *  Returns: String
     */
	public function get_row_name($name,$lines){
		foreach ($lines as $line) {
			if (strpos($line, "1234") !== false) {
		        return $line;
		    }
		}
		return false;
	}

}

?>