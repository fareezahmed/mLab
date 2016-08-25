<?php
// Fetching Values from URL.
$name = $_POST['name1'];
$email = $_POST['email1'];
$message = $_POST['message1'];
$contact = $_POST['contact1'];
$email = filter_var($email, FILTER_SANITIZE_EMAIL); // Sanitizing E-mail.
// After sanitization Validation is performed
if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
if (!preg_match("/^[0-9]{10}$/", $contact)) {
echo "<span>* Please Fill Valid Contact No. *</span>";
} else {
$subject = $name;
// To send HTML mail, the Content-type header must be set.
$headers = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'From:noreply@moonlab.com.au' . "\r\n"; // Sender's Email
//$headers .= 'Cc:' . $email. "\r\n"; // Carbon copy to Sender
$template = '<div style="padding:50px; color:white;">Hello ' . $name . ',<br/>'
. '<br/>Thank you...! For Contacting Us.<br/><br/>'
. 'Name:' . $name . '<br/>'
. 'Email:' . $email . '<br/>'
. 'Contact No:' . $contact . '<br/>'
. 'Message:' . $message . '<br/><br/>'
. 'This is a Contact Confirmation mail.'
. '<br/>'
. 'We Will contact You as soon as possible .</div>';
$sendmessage = "<div style=\"background-color:#7E7E7E; color:white;\">" . $template . "</div>";
// Message lines should not exceed 70 characters (PHP rule), so wrap it.
$sendmessage = wordwrap($sendmessage, 70);
// Send mail by PHP Mail Function.
mail($email, $subject, $sendmessage, $headers);



$template1 = '<div style="padding:50px; color:white;">Hello Ahmed ,<br/>'
. '<br/>Following person has contact us through the website. Below are the details.<br/><br/>'
. 'Name:' . $name . '<br/>'
. 'Email:' . $email . '<br/>'
. 'Contact No:' . $contact . '<br/>'
. 'Message:' . $message . '<br/><br/>'
. 'This is a Contact Confirmation mail.'
. '<br/>'
. 'We Will contact You as soon as possible .</div>';
$sendmessage1 = "<div style=\"background-color:#7E7E7E; color:white;\">" . $template1 . "</div>";
// Message lines should not exceed 70 characters (PHP rule), so wrap it.
$sendmessage1 = wordwrap($sendmessage1, 70);

mail("fareez1234@gmail.com", 'Contact Form message from moonlab.com.au', $sendmessage1, $headers);
mail("itisahmedd@gmail.com", 'Contact Form message from moonlab.com.au', $sendmessage1, $headers);
echo "Your Request has been received and We will contact you soon. Thank You";
}
} else {
echo "<span>* invalid email *</span>";
}
?>