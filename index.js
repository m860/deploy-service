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

app.get(/(\.apk|\.ipa)$/i,function(req,res){
	let url=req.originalUrl.replace('ftp','public').substring(1);
	res.sendfile(url);
});
app.use('/ftp', serveIndex('public', {'icons': true,view:"details"}))

function unzip(zipFilePath, callback = ()=>null, extraCallback = ()=>null) {
	let tempPath = path.join(__dirname, 'temp');

	function extra() {
		let extractor = tar.Extract({path: tempPath}).on('error', (err)=> {
			extraCallback(err);
		}).on('end', ()=> {
			extraCallback();
		});
		let reader = fs.createReadStream(zipFilePath).pipe(extractor);
		reader.on('error', (err)=> {
			console.error('an error occurred:', err);
			callback(err);
		});
		reader.on('finish', ()=> {
			console.log('unzip complete');
			callback();
		});
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
	unzip(req.file.path, (err)=> {
		if (err) {
			console.log(err);
		}
		else {
			let scriptPath = path.join(__dirname, 'temp', 'temp', 'script.js');
			let scriptText = fs.readFileSync(scriptPath, 'utf8');
			let script = requireFromString(scriptText);
			if (script) {
				script(copy, shell);
			}
		}
		res.end();
	});
});

var port = 4000;

app.listen(port, ()=> {
	console.log('The service is running on ' + port);
})