<?php
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

$to = 'sankofagisfoundation@gmail.com';
$formType = isset($_POST['form_type']) ? trim((string) $_POST['form_type']) : '';

$allowedTypes = [
    'contact',
    'resource_request',
    'volunteer',
    'sponsor',
    'mentee',
];

if (!in_array($formType, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid form type']);
    exit;
}

function value_or_empty($key)
{
    return isset($_POST[$key]) ? trim((string) $_POST[$key]) : '';
}

function safe_line($text)
{
    $text = str_replace(["\r", "\n"], ' ', $text);
    return trim($text);
}

function add_field(&$lines, $label, $value)
{
    if ($value !== '') {
        $lines[] = $label . ': ' . $value;
    }
}

$subjectPrefix = 'SGiS Website Form';
$lines = [];
$replyTo = '';

switch ($formType) {
    case 'contact':
        $subject = $subjectPrefix . ' - Contact Form';
        add_field($lines, 'First Name', value_or_empty('first_name'));
        add_field($lines, 'Last Name', value_or_empty('last_name'));
        add_field($lines, 'Email', value_or_empty('email'));
        add_field($lines, 'Phone', value_or_empty('phone'));
        add_field($lines, 'Audience', value_or_empty('audience'));
        $lines[] = '';
        $lines[] = 'Message:';
        $lines[] = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'resource_request':
        $subject = $subjectPrefix . ' - Resource Request';
        add_field($lines, 'Name', value_or_empty('name'));
        add_field($lines, 'Email', value_or_empty('email'));
        add_field($lines, 'School/Organization', value_or_empty('organization'));
        add_field($lines, 'Resource Needed', value_or_empty('resource'));
        $lines[] = '';
        $lines[] = 'Context:';
        $lines[] = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'volunteer':
        $subject = $subjectPrefix . ' - Volunteer Application';
        add_field($lines, 'First Name', value_or_empty('first_name'));
        add_field($lines, 'Last Name', value_or_empty('last_name'));
        add_field($lines, 'Email', value_or_empty('email'));
        add_field($lines, 'Phone', value_or_empty('phone'));
        add_field($lines, 'Science Field', value_or_empty('science_field'));
        $lines[] = '';
        $lines[] = 'Motivation:';
        $lines[] = value_or_empty('motivation');
        $replyTo = value_or_empty('email');
        break;

    case 'sponsor':
        $subject = $subjectPrefix . ' - Sponsorship Enquiry';
        add_field($lines, 'Organization', value_or_empty('organization'));
        add_field($lines, 'Contact Name', value_or_empty('contact_name'));
        add_field($lines, 'Job Title', value_or_empty('job_title'));
        add_field($lines, 'Email', value_or_empty('email'));
        add_field($lines, 'Phone', value_or_empty('phone'));
        add_field($lines, 'Sponsorship Interest', value_or_empty('sponsorship_interest'));
        $lines[] = '';
        $lines[] = 'Additional Message:';
        $lines[] = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'mentee':
        $subject = $subjectPrefix . ' - Mentee Application';
        add_field($lines, 'First Name', value_or_empty('first_name'));
        add_field($lines, 'Last Name', value_or_empty('last_name'));
        add_field($lines, 'Email', value_or_empty('email'));
        add_field($lines, 'Age', value_or_empty('age'));
        add_field($lines, 'School Level', value_or_empty('school_level'));
        add_field($lines, 'School/Institution', value_or_empty('school'));
        add_field($lines, 'Interest Area', value_or_empty('interest_area'));
        $lines[] = '';
        $lines[] = 'About:';
        $lines[] = value_or_empty('about');
        $replyTo = value_or_empty('email');
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unsupported form type']);
        exit;
}

$from = 'no-reply@' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: SGiS Website <' . safe_line($from) . '>',
];

if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . safe_line($replyTo);
}

$body = implode("\n", $lines);
$sent = mail($to, $subject, $body, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Email could not be sent from server']);
    exit;
}

echo json_encode(['success' => true]);
