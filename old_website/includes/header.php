<!-- 
Page Name: header.php
Page Type: header page
Developer: Fareez Ahmed
Page Description: This contains the head elements of the page
-->
<!DOCTYPE html>
<html lang="en">   
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?php echo $page_name ?> | MoonLab</title>

    <!-- Bootstrap -->
    <link href="bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <?php if($page_name == "Services"){
            echo '<link id="scrollUpTheme" rel="stylesheet" href="css/image.css">';
        }
    ?>
    <link href="css/mainStyle.css" rel="stylesheet">
    <link href="css/mediaQueryStyle.css" rel="stylesheet">
    <link href="css/hover-min.css" rel="stylesheet" media="all">

    <link rel="icon" type="image/gif" href="images/logo-icon.gif" />

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
      <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
        <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->
  </head>