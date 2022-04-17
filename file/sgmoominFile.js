var fs = require('fs'); //readFile
fs.readFile('sgmoomin.txt', 'utf8', function(err, data){
  console.log(data);
});
