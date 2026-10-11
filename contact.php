<?php
header("Content-Type: application/json; charset=UTF-8");

function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES);
    exit;
}

function textLength(string $value): int
{
    return function_exists("mb_strlen") ? mb_strlen($value, "UTF-8") : strlen($value);
}

function postText(string $key): string
{
    $value = $_POST[$key] ?? "";
    return is_string($value) ? trim($value) : "";
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST");
    respond(405, ["status" => "error", "message" => "Method not allowed."]);
}

$name = postText("name");
$email = postText("email");
$subject = str_replace(["\r", "\n"], " ", postText("subject"));
$message = postText("message");

if (
    $name === "" || textLength($name) > 50 ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) || textLength($email) > 100 ||
    $subject === "" || textLength($subject) > 100 ||
    $message === "" || textLength($message) > 500
) {
    respond(422, ["status" => "error", "message" => "Please check the form fields and try again."]);
}

$body = "New portfolio contact form submission\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . "Subject: {$subject}\n\n"
    . "Message:\n{$message}\n";

$headers = [
    "From: Portfolio contact <no-reply@semagrb.github.io>",
    "Reply-To: {$email}",
    "Content-Type: text/plain; charset=UTF-8",
];

if (!mail("fithisalma@proton.me", "Portfolio contact: {$subject}", $body, implode("\r\n", $headers))) {
    respond(500, ["status" => "error", "message" => "Unable to send your message right now. Please try again later."]);
}

respond(200, ["status" => "success", "message" => "Message sent successfully."]);
