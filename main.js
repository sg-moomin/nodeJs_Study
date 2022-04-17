var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateList(title, list, body){
  return`
  <!doctype html>
  <head>
  <style>
  table {
    font-family : courier,
    border-collapse : collapse;
    width : 100%;
  }

  td, th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }

  tr:nth-child(even) {
    background-color: #dddddd;
  }
  </style>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">Sg-moomin</a></h1>
    ${list}
    <a href="/form">Sg-moomin Create Text</a>
    ${body}
    </body>
    </html>`
  ;
}

function fileReadlist(filelist){
  var list = `<ul>`;
  var i;
  for(i = 0; i < filelist.length; i++){
    list = list + `<li><a href="/?id=${filelist[i]}">  we : ${filelist[i]}</a></li>`;
  }
  list = list + `</ul>`;
  return list;
}

// function textReturns(descriptionText){
//   var texts = "<br>"
//   for(i = 0; i < descriptionText.length; i++){
//     if(descriptionText.includes(texts) === True){
//
//     }
//   }
// }

function responseReturn(template, response){
  response.writeHead(200);
  response.end(template);
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log(queryData);
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./sgmoominFile', function(error, filelist){
        var title = "hello";
        var descript = "welcome";
        var list = fileReadlist(filelist);
        var template = templateList(title, list, `<h2>${title}</h2>`);
        responseReturn(template, response);
          })
        } else {
      fs.readdir('./sgmoominFile', function(error, filelist){
        fs.readFile(`sgmoominFile/${queryData.id}`, 'utf8', function(err, description){
          fs.readFile(`file/sgmoomin.txt`, 'utf8', function(err, descriptionText){
            var title = queryData.id;
            // var description = "Hello - Sg Moomin ";
            var list = fileReadlist(filelist);
            console.log(title);
            var template = templateList(title, list, `<h2>${title}</h2><h2>${descriptionText}</h2>${description}`);
            responseReturn(template, response);
          });
        });
      });
      }
    }else if(pathname === '/form'){
        fs.readdir('./form', function(error, filelist){
          var title = "create Text";
          var list = fileReadlist(filelist);
          fs.readFile(`form/form.html`, 'utf8', function(err, description){
          var template = templateList(title, list, `<h2>${title}</h2><h2>${description}</h2>`);
          responseReturn(template, response);
        });
      });
    } else if(pathname === '/create_form') {
      var body = '';
      request.on('data', function(data){
         body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;
          console.log(post, title, description);

          fs.writeFile(`file/${title}`, description, 'utf8', function(err){
            response.writeHead(302, {Location : `/?id=${title}`});
            response.end();
          })
      });
      response.writeHead(200);
      response.end('success');
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
