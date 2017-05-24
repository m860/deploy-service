/**
 * Created by jean.h.ma on 5/8/17.
 */
var tar = require('tar');
var fs = require('fs');
var path = require('path');
var fstream = require("fstream");
var request = require("request");

var zipPath = path.join(__dirname, 'zip.tar');

// test('tar file', function () {
//
// 	if(fs.existsSync(zipPath)){
// 		fs.unlink(zipPath);
// 	}
// 	var dirDest = fs.createWriteStream(zipPath);
//
// 	function onError(err) {
// 		console.error('An error occurred:', err)
// 	}
//
// 	function onEnd() {
// 		console.log('Packed!');
// 	}
//
// 	var packer = tar.Pack({noProprietary: true})
// 		.on('error', onError)
// 		.on('end', onEnd);
// 	fstream.Reader({
// 		path: path.join(__dirname, '../dist')
// 	})
// 		.on('error', onError)
// 		.pipe(packer)
// 		.pipe(dirDest);
// });

test('upload file', function () {
	request.post({
		url: 'http://127.0.0.1:3001',
		formData: {
			package: fs.createReadStream(zipPath)
		}
	}, function (err) {
		if (err) {
			return console.error(err);
		}
		console.log('upload success');
	})
});

