<?php
// Basic setup for processing booking form

header('Content-Type: application/json');

// Database credentials
$servername = "localhost";
$username = "eisrael062@gmail.com";
$password = "violafianko";
$dbname = "Rita'Salon"; // Replace with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]));
}

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    $conn->close();
    exit;
}

$success = false;
$message = '';

// Basic extraction and processing for demo purpose
if (isset($_POST['name'], $_POST['email'], $_POST['phone'], $_POST['date'], $_POST['time'], $_POST['service'])) {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $phone = $_POST['phone'];
    $date = $_POST['date'];
    $time = $_POST['time'];
    $service = $_POST['service'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO bookings (name, email, phone, date, time, service) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $name, $email, $phone, $date, $time, $service);

    if ($stmt->execute()) {
        $success = true;
        $message = 'Booking successfully processed';
    } else {
        $message = 'Failed to process booking: ' . $stmt->error;
    }

    $stmt->close();
} else {
    $message = 'Missing required fields';
}

$conn->close();

// Return JSON response
echo json_encode(['success' => $success, 'message' => $message]);
?>
