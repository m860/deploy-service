/**
 * Created by jean.h.ma on 5/8/17.
 */
import express from 'express'
import multer from 'multer'
import tar from 'tar'
import fs from 'fs'
import path from 'path'
import requireFromString from 'require-from-string'
import fse from 'fs-extra'
import shell from 'shelljs'
import rmdir from 'rmdir'
import serveIndex from 'serve-index'

let upload = multer({dest: 'uploads/'});

let app = express();

app.use('/ftp', serveIndex('public', {'icons': true}))

function unzip(zipFilePath) {
	function onError(err) {
		console.error('An error occurred:', err)
	}

	function onEnd() {
		console.log('unzip complete')
	}

	let tempPath = path.join(__dirname, 'temp');

	function extra() {
		let extractor = tar.Extract({
			path: tempPath
		})
			.on('error', onError)
			.on('end', onEnd);

		fs.createReadStream(zipFilePath)
			.on('error', onError)
			.pipe(extractor);
	}

	if (fs.existsSync(tempPath)) {
		rmdir(tempPath, function () {
			extra();
		})
	}
	else {
		extra();
	}
}

function zip(zipPath, dirPath) {
	var dirDest = fs.createWriteStream(zipPath);

	function onError(err) {
		console.error('An error occurred:', err)
	}

	function onEnd() {
		console.log('Packed!');
	}

	var packer = tar.Pack({noProprietary: true})
		.on('error', onError)
		.on('end', onEnd);
	fstream.Reader({
		path: dirPath
	})
		.on('error', onError)
		.pipe(packer)
		.pipe(dirDest);
}

function copy(target) {
	fse.copySync(path.join(__dirname, 'temp', 'temp', 'package'), target);
}

app.post('/', upload.single('package'), (req, res)=> {
	//unzip
	unzip(req.file.path);

	setTimeout(()=> {
		let scriptPath = path.join(__dirname, 'temp', 'temp', 'script.js');
		let scriptText = fs.readFileSync(scriptPath, 'utf8');
		let script = requireFromString(scriptText);
		if (script) {
			script(copy, shell);
		}
		res.end();
	}, 2000);

});

app.listen(3001, ()=> {
	console.log('The service is running on 3001');
})