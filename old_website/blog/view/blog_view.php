<!DOCTYPE html>
<html lang="en">
<?php  require "includes/header.php"; ?>
<script>
  $(function() {
    $( "#tabs" ).tabs();
  });
</script>
<body style="background-color:white;width:95%;margin:auto">
  <p class="pull-right">Welcome, <?= $username?>| <a href="logout.php">Logout</a></p>
  <div class="clearfix"></div>
  <h1 style="">Blog</h1>
  <div id="tabs">
  <ul>
    <li><a href="#tabs-1">Read Post</a></li>
    <li><a href="#tabs-2">Write Post</a></li>
  </ul>
  <div id="tabs-1">
    <p><?= $blog_list; ?></p>
  </div>
  <div id="tabs-2">
    <div class="well" style="width:80%; margin:auto">
        <form role="form" action="" method="POST">
          <div class="form-group">
            <label for="title">title</label>
            <input type="text" class="form-control" id="title" name="title" placeholder="post title" required>
          </div>
          <div class="form-group">
            <label for="body">body</label>
            <textarea class="form-control" rows="3" id="body" name="body" placeholder="post body" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary pull-right" name="postSumit">Submit</button>
          <div class="clearfix"></div>
          <?php if ( isset($status) ) : ?>
            <p><? echo $status; ?></p>
          <?php endif; ?>
        </form>
    </div>
  </div>

</div>
  
  </body>
</html>