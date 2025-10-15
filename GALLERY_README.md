# Gallery Dynamic Image Loading

## How It Works

The gallery now automatically loads all images from the `assets/gallery` folder without needing to hardcode filenames.

## Setup Options

### Option 1: Using PHP (Recommended)
1. Ensure you have PHP installed on your server
2. The `get-gallery-images.php` file will automatically scan the `assets/gallery` folder
3. Simply add new images to `assets/gallery/` and they will appear automatically

### Option 2: Static File Server
If PHP is not available, the system will use a fallback list. To update:
1. Add your images to `assets/gallery/`
2. Update the fallback array in `app.js` (or use a build script to generate it)

## Adding New Images

1. Place your image files (jpg, jpeg, png, gif, webp) in the `assets/gallery/` folder
2. Refresh the page - new images will appear automatically in the gallery modal
3. Update the preview images in `index.html` if you want to change the 3 preview images shown on the main page

## Supported Formats
- JPG/JPEG
- PNG
- GIF
- WebP

## How to Test
1. Start a PHP server: `php -S localhost:8000`
2. Open http://localhost:8000 in your browser
3. Click on gallery items to see all images from the folder

## Fallback Behavior
If PHP is not available (e.g., when opening index.html directly), the gallery will use the hardcoded fallback list of current images. This ensures the site works in any environment.
