## Usage

```javascript
import request from 'request'
import fs from 'fs'

request.post({
	url:'http://127.0.0.1:3001',
	formData:{
		package:fs.createReadStream(ZIP_PATH)
	}
})
```

## tar 文件结构

    package.tar
      |-package
      |-script.js

### script.js

```javascript
module.exports=function(copyTo,shell){

	// copy to d:/service
	copyTo('d:/service');
	
	//restart service
	shell.exec('pm2 reload all');
	
}
```