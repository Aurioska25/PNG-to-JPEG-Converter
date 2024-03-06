const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Function to convert PNG to JPEG
function convertPNGtoJPEG(inputImagePath, outputImagePath) {
    // Create a canvas
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');

    // Load the PNG image onto the canvas
    loadImage(inputImagePath).then((image) => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        // Convert the canvas to a JPEG image
        const jpegStream = canvas.createJPEGStream({
            quality: 0.95, // Adjust quality as needed (0.0 - 1.0)
            chromaSubsampling: false,
        });

        // Save the JPEG image to a file
        const out = fs.createWriteStream(outputImagePath);
        jpegStream.pipe(out);
        out.on('finish', () => {
            console.log('\x1b[32m', `Converted ${inputImagePath} to JPEG.`);
            // Delete the original PNG file after successful conversion
            fs.unlink(inputImagePath, (err) => {
                if (err) {
                    console.error('\x1b[31m', `Error deleting ${inputImagePath}:`, err);
                } else {
                    console.log('\x1b[33m', `Deleted ${inputImagePath}`);
                }
            });
        });
    }).catch((err) => {
        console.error('\x1b[31m', `Error converting ${inputImagePath}:`, err);
    });
}

// Specify the input and output folders
const inputFolder = 'C:/Users/Auramas/Desktop/InstaPoster/InstaPhotos';
const outputFolder = 'C:/Users/Auramas/Desktop/InstaPoster/InstaPhotos';

// Read the contents of the input folder
fs.readdir(inputFolder, (err, files) => {
    if (err) {
        console.error('\x1b[31m', 'Error reading input folder:', err);
        return;
    }

    // Filter PNG files
    const pngFiles = files.filter(file => path.extname(file).toLowerCase() === '.png');

    // Convert each PNG file to JPEG
    pngFiles.forEach((file) => {
        const inputImagePath = path.join(inputFolder, file);
        const outputImagePath = path.join(outputFolder, `${path.parse(file).name}.jpg`);
        convertPNGtoJPEG(inputImagePath, outputImagePath);
    });
});
