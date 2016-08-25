<!-- 
Page Name: contact.php
Page Type: View
Developer: Fareez Ahmed
Page Description: This is view of the contact page 
-->

<!DOCTYPE html>
<html lang="en">
	<?php  require "includes/header.php"; ?>

<body class="contact">
	<?php require "includes/navigation.php"; ?>

<!-- contact Page content Section -->
  <section>
      <article>
        <h1>CONTACT</h1>
        <hr>
        <h2><span>G'Day</span></h2>
        <p class="pull-center info">Feel free to Call US @<a href="tel:1300882309" target="_blank">1300 882 309</a><br> <strong>OR</strong>
          <br> Email US
        @ <a href="mailto:info@MoonLab.com.au" target="_blank">info@moonlab.com.au</a>  to get a Quote for Your Dream Website.</p>
        <p class="pull-center note">Lets Make that Online Business Dream a Reality<br>
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-default" data-toggle="modal" data-target="#contactModal">
            Contact Form
          </button>
          <br>
        </p>
      </article>
  </section>



<!-- Modal -->
<div class="modal fade" id="contactModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title" id="myModalLabel">User Contact Form</h4>
      </div>
      <div class="modal-body">
          <form action="" method="post">
            <div class="form-group row">
              <label for="fname" class="col-sm-1 control-label">Name</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" id="fname" name="fname" placeholder="Full Name" required>
              </div>
              <div class="col-sm-1 no-padding-no-margin"><span class="required-field">*</span></div>
            </div>
            <div class="form-group row">
              <label for="email" class="col-sm-1 control-label">Email</label>
              <div class="col-sm-9">
                <input type="email" class="form-control" id="email" name="email" placeholder="Vaild Email">
              </div>
              <div class="col-sm-1 no-padding-no-margin"><span class="required-field">*</span></div>
            </div>
            <div class="form-group row">
              <label for="subject" class="col-sm-1 control-label">Subject</label>
              <div class="col-sm-9">
                <input type="text" class="form-control" id="subject" name="subject" placeholder="Message Subject">
              </div>
              <div class="col-sm-1 no-padding-no-margin"><span class="required-field">*</span></div>
            </div>
            <div class="form-group row">
              <label for="message" class="col-sm-1 control-label">Message</label>
              <div class="col-sm-9">
                <textarea id="message" name="message"  class="form-control" rows="3" placeholder="enter your message in 500 characters" size="500" required></textarea>
              </div>
              <div class="col-sm-1 no-padding-no-margin"><span class="required-field">*</span></div>
            </div>
            <div class="form-group row">
              <div class="col-sm-2"></div>
              <div class="col-sm-8">
                <input type="submit" class="btn btn-primary" value="Send">
                <input type="reset" class="btn btn-default" value="Reset">
              </div>
              <div class="col-sm-2"></div>
            </div> 
          </form>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>

<!-- End of contact Page content Section -->

	<?php include "includes/footer.php"; ?>
  </body>
</html>