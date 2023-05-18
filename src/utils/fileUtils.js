const fs = require('fs');
const path = require('path');

const folderPath = './../../uploads'; // Replace with the actual path to your folder

export function deletePrevFiles() {
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        // Iterate through all files in the folder
        for (const file of files) {
            const filePath = path.join(folderPath, file);

            // Use fs.unlink to remove the file
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('File deleted:', filePath);
                }
            });
        }
    });
}

