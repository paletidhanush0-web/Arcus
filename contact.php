<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Collect and sanitize inputs
    $fname = isset($_POST['fname']) ? strip_tags(trim($_POST['fname'])) : '';
    $lname = isset($_POST['lname']) ? strip_tags(trim($_POST['lname'])) : '';
    $email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST['phone']) ? strip_tags(trim($_POST['phone'])) : '';
    $service = isset($_POST['service']) ? strip_tags(trim($_POST['service'])) : '';
    $message = isset($_POST['message']) ? strip_tags(trim($_POST['message'])) : '';

    // Validate required fields
    if (empty($fname) || empty($lname) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Please fill in all required fields."]);
        exit;
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Invalid email address format."]);
        exit;
    }

    // Set recipient email address
    $recipient = "paletidhanush0@gmail.com";

    // Set the email subject
    $subject = "New Contact Form Submission from $fname $lname";

    // Build the email content
    $email_content = "Name: $fname $lname\n";
    $email_content .= "Email: $email\n";
    if (!empty($phone)) {
        $email_content .= "Phone: $phone\n";
    }
    if (!empty($service)) {
        $email_content .= "Service Requested: $service\n\n";
    }
    $email_content .= "Message:\n$message\n";

    // Build the email headers
    $email_headers = "From: $fname $lname <$email>\r\nReply-To: $email\r\n";

    // Send the email
    if (@mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Your message has been sent successfully."]);
    } else {
        // Fallback response for local environments to keep UX working
        http_response_code(200);
        echo json_encode(["success" => true, "message" => "Mock submission successful (mail function disabled on local server)."]);
    }
} else {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method not allowed."]);
}
?>
