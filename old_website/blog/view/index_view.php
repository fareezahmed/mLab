<!DOCTYPE html>
<html lang="en">
<?php  require "includes/header.php"; ?>
<style type="text/css">
  .alert-error{
    background-color: rgb(253, 140, 140);
    color:#fff;
    border-color: red;
    font-size: 16px;
  }
</style>
<body>
  <h1 style="color:white;text-align:center;margin-top:10%;">Login</h1>
  <div class="well" style="width:400px; margin:auto">
      <form role="form" action="" method="POST">
        <div class="form-group">
          <label for="username">Username</label>
          <input type="text" class="form-control" id="username" name="username" placeholder="Username" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" class="form-control" id="password" name="password" placeholder="Password" required>
        </div>
        <button type="submit" class="btn btn-primary pull-right">Submit</button>
        <div class="clearfix"></div>
        <?php if ( isset($status) ) : ?>
          <p><? echo $status; ?></p>
        <?php endif; ?>
      </form>
  </div>
<?php  require "includes/footer.php"; ?>
</body>
</html>