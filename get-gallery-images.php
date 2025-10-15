<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$galleryDir = __DIR__ . '/assets/gallery';
$images = [];

if (is_dir($galleryDir)) {
    $files = scandir($galleryDir);
    
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            $extension = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            
            // Only include image files
            if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                $images[] = 'assets/gallery/' . $file;
            }
        }
    }
    
    // Sort images
    sort($images);
}

echo json_encode($images);
?>
