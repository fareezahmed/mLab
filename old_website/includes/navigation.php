<!-- 
Page Name: navigation.php
Page Type: navigation page
Developer: Fareez Ahmed
Page Description: This contains the navigation elements of the page
-->    
    <header>
      <nav class="navbar navbar-default" role="navigation">
        <div class="container-fluid">
          <!-- Brand and toggle get grouped for better mobile display -->
          <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span class="sr-only">Toggle navigation</span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
              <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="index.php"><img src="images/logo-sm.png" width="30" heoght="30"> MoonLab</a>
          </div>

          <!-- Collect the nav links, forms, and other content for toggling -->
          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
            </ul>

            <ul class="nav navbar-nav navbar-right">
              <li class="<?php echo ($current_page_name == "home" ? "active" : "")?>"><a href="index.php">Home</a></li>
              <li class="<?php echo ($current_page_name == "about" ? "active" : "")?>"><a href="about.php">About</a></li>
              <li class="<?php echo ($current_page_name == "service" ? "active" : "")?>"><a href="services.php">Services</a></li>
              <li class="<?php echo ($current_page_name == "contact" ? "active" : "")?>"><a href="contact.php">Contact</a></li>
            </ul>
          </div><!-- /.navbar-collapse -->
        </div><!-- /.container-fluid -->
      </nav>
    </header>