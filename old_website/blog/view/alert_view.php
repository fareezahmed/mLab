 <p class="alert-message alert <?php echo $mail_info_class; ?>">
 	<?php echo $mail_message; ?>
 </p>
<script>
	window.onload = function() {
		 setTimeout(function() {$('.alert-message').fadeOut('fast');}, 2000);
	};
	  
</script>