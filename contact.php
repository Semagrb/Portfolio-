<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $subject = htmlspecialchars(trim($_POST['subject']));
    $message = htmlspecialchars(trim($_POST['message']));
    
    // Your email address
    $to = "fithisalma@gmail.com";
    
    // Email subject
    $email_subject = "Portfolio Contact: " . $subject;
    
    // Email body
    $email_body = "
    🌸 New Portfolio Contact Form Submission 🌸
    
    Name: $name
    Email: $email
    Subject: $subject
    
    Message:
    $message
    
    ---
    Sent from your portfolio contact form 💅🏻
    ";
    
    // Email headers
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    if (mail($to, $email_subject, $email_body, $headers)) {
        // Success response
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'Message sent successfully! 🌸'
        ]);
    } else {
        // Error response
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Sorry, there was an error sending your message. Please try again.'
        ]);
    }
} else {
    // Invalid request method
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed.'
    ]);
}
?>
