<?php 

require (__DIR__ . '/config.php');

// namespace Blog\Modal

class Database extends Config{

	/**
     * This method is use to create connection to take base
     *  Returns: database connection OBJECT
     */
	public function connect_database(){
		try{
			//$link = new PDO('mysql:host=localhost;dbname=monashis_blog', "monashis_admin","fareez1234");
			$link = new PDO('mysql:host=localhost;dbname=monashis_blog', parent::getDbUsername(), parent::getDBbPassword());
			$link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			return $link;
		}catch(Exception $e){
			return false;
		}
		
	}

	/**
     * This method is use to fetch all data from give table
     *  Returns: Array containing all the rows
     */
	public function fetch_all($database_link, $tablename="blog"){
		try{
			// Used PDO Query statement to from database
			$result = $database_link->query("SELECT * FROM $tablename ORDER BY id DESC");
			if($result->rowCount() > 0){
				return $result;
			}else{
				return false;
			}
		}catch(PDOException $e){
			return $e;
		}
	}

	/**
     * This method is use to fetch data by id column from give table
     *  Returns: Object with column names as properties
     */
	public function fetch_by_id($database_link, $tablename = "blog", $id = "1"){
		try{
				$query = "SELECT * FROM $tablename WHERE id = :id";
				//Using prepae statement to protect against SQL Injections
				$statement = $database_link->prepare($query);
				$statement->bindParam(":id", $id, PDO::PARAM_STR);
				$statement->execute();
				$result = $statement->fetch(PDO::FETCH_OBJ);
				return $result;
		}catch(PDOException $e){
			return false;
		}

	}

	/**
     * This method is use to insert data in a new row
     *  Boolean - indicate sucess or failure of insert operation
     */
	public function insert_row($row_data, $database_link, $tablename = "blog"){
		try{
				$query = "INSERT INTO $tablename (title, body) VALUES (:title,:body)";
				$statement = $database_link->prepare($query);
				$statement->bindParam(":title", $row_data["title"], PDO::PARAM_STR);
				$statement->bindParam(":body", $row_data["body"], PDO::PARAM_STR);
				return $statement->execute() ? true : false;

		}catch(PDOException $e){
			return false;
		}
	}

	/**
     * This method is use to delete a row identified by the row id
     *  Boolean - indicate sucess or failure of insert operation
     */
	public function delete_row_by_id($id, $database_link, $tablename = "blog"){
		try{
				$query = "DELETE FROM $tablename WHERE id = :id";
				$statement = $database_link->prepare($query);
				$statement->bindParam(":id", $id, PDO::PARAM_INT);
				return $statement->execute() ? true : false;

		}catch(PDOException $e){
			return false;
		}
	}
}

?>