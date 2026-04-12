<?php
/**
 * Skill Selection Form Handler
 * Saves submissions to a JSON file and sends email notification
 */

// Configuration
$ADMIN_EMAIL = 'skills@aiopenclawskills.com';
$DATA_FILE = __DIR__ . '/submissions/skill-selections.json';

// CORS headers for cross-origin requests
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    // Try form data
    $data = $_POST;
}

// Validate required fields
$required = ['order_number', 'email', 'name', 'skills'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Validate skills count
$skills = is_array($data['skills']) ? $data['skills'] : [$data['skills']];
if (count($skills) > 5) {
    http_response_code(400);
    echo json_encode(['error' => 'Maximum 5 skills allowed']);
    exit;
}

// Prepare submission
$submission = [
    'timestamp' => date('Y-m-d H:i:s'),
    'order_number' => htmlspecialchars($data['order_number']),
    'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
    'name' => htmlspecialchars($data['name']),
    'skills' => array_map('htmlspecialchars', $skills),
    'notes' => htmlspecialchars($data['notes'] ?? ''),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
];

// Ensure submissions directory exists
if (!is_dir(__DIR__ . '/submissions')) {
    mkdir(__DIR__ . '/submissions', 0755, true);
}

// Load existing submissions
$submissions = [];
if (file_exists($DATA_FILE)) {
    $content = file_get_contents($DATA_FILE);
    $submissions = json_decode($content, true) ?: [];
}

// Add new submission
$submissions[] = $submission;

// Save to file
file_put_contents($DATA_FILE, json_encode($submissions, JSON_PRETTY_PRINT));

// Send email notification
$subject = "Pro Onboarding Skill Selection - {$submission['order_number']}";
$skillsList = implode("\n- ", $submission['skills']);
$message = <<<EMAIL
New Pro Onboarding Skill Selection

Order Number: {$submission['order_number']}
Customer: {$submission['name']}
Email: {$submission['email']}
Date: {$submission['timestamp']}

Selected Skills ({$submission['count']}):
- {$skillsList}

Notes:
{$submission['notes']}

---
View all submissions: https://aiopenclawskills.com/submissions/
EMAIL;

$headers = "From: noreply@aiopenclawskills.com\r\n";
$headers .= "Reply-To: {$submission['email']}\r\n";

@mail($ADMIN_EMAIL, $subject, $message, $headers);

// Return success
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'Skill selection submitted successfully',
    'redirect' => '/thank-you.html'
]);
