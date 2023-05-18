import express, { Application } from 'express';
import cors from 'cors';
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(
	cors({
		origin: 'http://127.0.0.1:5500'
	})
);
app.use(express.json());

const storage = multer.diskStorage({
	destination: 'uploads/', // Directory where uploaded files will be stored
	filename: (req: any, file: any, cb: any) => {
		cb(null, 'test.jpg'); // File name will be unique timestamp + original file name
	}
});

const upload = multer({ storage: storage });

// Function to delete all files in a folder
const deleteFilesInFolder = async (folderPath: any) => {
	await fs.readdir(folderPath, async (err: any, files: any) => {
		if (err) {
			console.error('Error reading folder:', err);
			return;
		}

		for (const file of files) {
			const filePath = `${folderPath}/${file}`;

			await fs.unlinkSync(filePath);
			console.log('File deleted:', filePath);
		}
	});
};

const folderPath = 'uploads';

app.delete('/delete-files', async (req, res) => {
	await deleteFilesInFolder(folderPath);

	res.status(200).send('Folder Emptied');
});
app.post('/image', async (req, res) => {
	upload.single('image')(req, res, (err: any) => {
		if (err) {
			console.error('Error uploading image:', err);
			return res.status(500).send('Error uploading image.');
		}

		const command = `src\\python\\DentalXrayAnalysis.py`;
		const pythonScript = spawn('python', [command]);

		// Listen to the output from the Python script
		pythonScript.stdout.on('data', (data: any) => {
			const output = data.toString().trim();

			if (output === 'Female') {
				res.status(200).send({
					gender: 'female'
				});
			}
			else if (output === 'Male') {
				res.status(200).send({
					gender: 'male'
				});
			}
			console.log(`Python script output: ${data}`);
		});

		// Listen to any errors that occur during execution
		pythonScript.stderr.on('data', (data: any) => {
			console.error(`Error executing Python script: ${data}`);
		});

		// Execute the script and pass any necessary arguments
		pythonScript.on('close', (code: any) => {
			console.log(`Python script process exited with code ${code}`);
		});

	});
});
app.listen(port, () => console.log(`Server started on port ${port}`));
