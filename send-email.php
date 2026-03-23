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

function esc_html($text)
{
    return htmlspecialchars((string) $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

$subjectPrefix = 'SGiS Website Form';
$fields = [];
$messageLabel = '';
$messageValue = '';
$formTitle = '';
$replyTo = '';

switch ($formType) {
    case 'contact':
        $formTitle = 'Contact Form';
        $subject = $subjectPrefix . ' - ' . $formTitle;
        $fields = [
            'First Name' => value_or_empty('first_name'),
            'Last Name' => value_or_empty('last_name'),
            'Email' => value_or_empty('email'),
            'Phone' => value_or_empty('phone'),
            'Audience' => value_or_empty('audience'),
        ];
        $messageLabel = 'Message';
        $messageValue = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'resource_request':
        $formTitle = 'Resource Request';
        $subject = $subjectPrefix . ' - ' . $formTitle;
        $fields = [
            'Name' => value_or_empty('name'),
            'Email' => value_or_empty('email'),
            'School/Organization' => value_or_empty('organization'),
            'Resource Needed' => value_or_empty('resource'),
        ];
        $messageLabel = 'Context';
        $messageValue = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'volunteer':
        $formTitle = 'Volunteer Application';
        $subject = $subjectPrefix . ' - ' . $formTitle;
        $fields = [
            'First Name' => value_or_empty('first_name'),
            'Last Name' => value_or_empty('last_name'),
            'Email' => value_or_empty('email'),
            'Phone' => value_or_empty('phone'),
            'Science Field' => value_or_empty('science_field'),
        ];
        $messageLabel = 'Motivation';
        $messageValue = value_or_empty('motivation');
        $replyTo = value_or_empty('email');
        break;

    case 'sponsor':
        $formTitle = 'Sponsorship Enquiry';
        $subject = $subjectPrefix . ' - ' . $formTitle;
        $fields = [
            'Organization' => value_or_empty('organization'),
            'Contact Name' => value_or_empty('contact_name'),
            'Job Title' => value_or_empty('job_title'),
            'Email' => value_or_empty('email'),
            'Phone' => value_or_empty('phone'),
            'Sponsorship Interest' => value_or_empty('sponsorship_interest'),
        ];
        $messageLabel = 'Additional Message';
        $messageValue = value_or_empty('message');
        $replyTo = value_or_empty('email');
        break;

    case 'mentee':
        $formTitle = 'Mentee Application';
        $subject = $subjectPrefix . ' - ' . $formTitle;
        $fields = [
            'First Name' => value_or_empty('first_name'),
            'Last Name' => value_or_empty('last_name'),
            'Email' => value_or_empty('email'),
            'Age' => value_or_empty('age'),
            'School Level' => value_or_empty('school_level'),
            'School/Institution' => value_or_empty('school'),
            'Interest Area' => value_or_empty('interest_area'),
        ];
        $messageLabel = 'About';
        $messageValue = value_or_empty('about');
        $replyTo = value_or_empty('email');
        break;

    default:
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Unsupported form type']);
        exit;
}

$hostRaw = (string) ($_SERVER['HTTP_HOST'] ?? 'localhost');
$host = preg_replace('/:\\d+$/', '', trim($hostRaw));
$from = 'no-reply@' . ($host !== '' ? $host : 'localhost');
$logoUrl = 'https://' . ($host !== '' ? $host : 'localhost') . '/assets/images/sankofablack.png';

$textLines = [];
$textLines[] = 'Sankofa Girls in Science Foundation';
$textLines[] = $formTitle;
$textLines[] = str_repeat('=', 44);

foreach ($fields as $label => $value) {
    if ($value !== '') {
        $textLines[] = $label . ': ' . $value;
    }
}

if ($messageValue !== '') {
    $textLines[] = '';
    $textLines[] = $messageLabel . ':';
    $textLines[] = $messageValue;
}

$textLines[] = '';
$textLines[] = 'Submitted At: ' . date('Y-m-d H:i:s');
$textLines[] = 'Source: ' . ($_SERVER['HTTP_HOST'] ?? 'unknown-host');
$plainBody = implode("\n", $textLines);

$rows = '';
foreach ($fields as $label => $value) {
    if ($value === '') {
        continue;
    }
    $rows .= '<tr>'
        . '<td style="padding:10px 12px;border:1px solid #e5e7eb;background:#f9fafb;font-weight:700;width:220px;">' . esc_html($label) . '</td>'
        . '<td style="padding:10px 12px;border:1px solid #e5e7eb;">' . nl2br(esc_html($value)) . '</td>'
        . '</tr>';
}

$messageBlock = '';
if ($messageValue !== '') {
    $messageBlock = '<h3 style="margin:20px 0 8px;font-size:16px;color:#111827;">' . esc_html($messageLabel) . '</h3>'
        . '<div style="padding:12px;border:1px solid #e5e7eb;background:#ffffff;line-height:1.6;color:#1f2937;">'
        . nl2br(esc_html($messageValue))
        . '</div>';
}

$htmlBody = '<!doctype html>'
    . '<html><body style="margin:0;padding:24px;background:#f8f8fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">'
    . '<div style="max-width:720px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;">'
    . '<div style="padding:18px 22px;background:linear-gradient(90deg,#111827 0%,#1f2937 100%);color:#ffffff;">'
    . '<table role="presentation" style="width:100%;border-collapse:collapse;">'
    . '<tr>'
    . '<td style="vertical-align:middle;">'
    . '<img src="' . esc_html($logoUrl) . '" alt="Sankofa Girls in Science Foundation" style="height:42px;width:auto;display:block;background:#ffffff;padding:6px 8px;border-radius:8px;" />'
    . '</td>'
    . '<td style="text-align:right;vertical-align:middle;">'
    . '<p style="margin:0;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#a7f3d0;">New Submission</p>'
    . '<p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#ffffff;">' . esc_html($formTitle) . '</p>'
    . '</td>'
    . '</tr>'
    . '</table>'
    . '</div>'
    . '<div style="padding:22px;">'
    . '<p style="margin:0 0 14px;font-size:14px;color:#4b5563;">A new form submission was received via the SGiS website.</p>'
    . '<table role="presentation" style="border-collapse:collapse;width:100%;font-size:14px;color:#111827;">'
    . $rows
    . '</table>'
    . $messageBlock
    . '<div style="margin-top:20px;padding-top:12px;border-top:1px solid #e5e7eb;">'
    . '<p style="margin:0;font-size:12px;color:#6b7280;">Submitted at ' . esc_html(date('Y-m-d H:i:s')) . ' from ' . esc_html($hostRaw !== '' ? $hostRaw : 'unknown-host') . '.</p>'
    . '</div>'
    . '</div>'
    . '<div style="padding:12px 22px;background:#f9fafb;border-top:1px solid #e5e7eb;">'
    . '<p style="margin:0;font-size:12px;color:#6b7280;">Sankofa Girls in Science Foundation | Empowering girls to pursue successful careers in STEM.</p>'
    . '</div>'
    . '</div>'
    . '</body></html>';

$boundary = 'sgis-boundary-' . md5((string) mt_rand());
$headers = [
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $boundary . '"',
    'From: SGiS Website <' . safe_line($from) . '>',
];

if ($replyTo !== '' && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
    $headers[] = 'Reply-To: ' . safe_line($replyTo);
}

$multipartBody = '';
$multipartBody .= '--' . $boundary . "\r\n";
$multipartBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
$multipartBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$multipartBody .= $plainBody . "\r\n\r\n";
$multipartBody .= '--' . $boundary . "\r\n";
$multipartBody .= "Content-Type: text/html; charset=UTF-8\r\n";
$multipartBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$multipartBody .= $htmlBody . "\r\n\r\n";
$multipartBody .= '--' . $boundary . "--\r\n";

$sent = mail($to, $subject, $multipartBody, implode("\r\n", $headers));

if (!$sent) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Email could not be sent from server']);
    exit;
}

echo json_encode(['success' => true]);
