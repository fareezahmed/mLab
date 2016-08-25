<?php 
/**
 * This Class contains configuration variable for the Application
 */
class Config{
	//Private Varibale containing login details
	private $db_username = "monashis_admin";
	private $db_password = "fareez1234";

	/**
     * This method is use to get the Database Admin Username
     *  Returns: String 
     */
	public function getDbUsername(){
		return $this->db_username;
	}

	/**
     * This method is use to get the Database Admin Password
     *  Returns: String
     */
	public function getDBbPassword(){
		return $this->db_password;
	}

}


?>