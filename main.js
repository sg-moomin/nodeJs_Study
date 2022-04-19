var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateList(title, list, body, create){
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
    <h1><a href="/">Home</a></h1>
    ${list}
    ${create}
    ${body}
    </body>
    </html>`
  ;
}

function fileReadlist(filelist){
  var list = `<ul>`;
  var i;
  for(i = 0; i < filelist.length; i++){
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
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

function responseErrorReturn(errCode, endCode, response){
  response.writeHead(errCode);
  response.end(endCode);
}

function responseLocationWriteReturn(code, location, response){
  response.writeHead(code, {Location : location});
  response.end();
}


var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // console.log(queryData);
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./sgmoominFile', function(error, filelist){
        var title = "hello welcome";
        var descript = "Tistory welcome";
        var list = fileReadlist(filelist);

        var template = templateList(title, list, `<h2>${title}</h2><h2>${descript}</h2>`,
          `<a href="/form">create</a>`, '');
        responseReturn(template, response);
          })
        } else {
      fs.readdir('./sgmoominFile', function(error, filelist){
        fs.readFile(`sgmoominFile/${queryData.id}`, 'utf8', function(err, description){
          var fileUrl = "file/sgmoomin.txt";
          var title = queryData.id;
          // var description = "Hello - Sg Moomin ";
          var list = fileReadlist(filelist);
          var template = templateList(title, list, `<h2>${title}</h2><h2>${description}</h2>`
          ,`<a href="/form">create</a> <a href="/update?id=${title}">update</a> <a href="/delete?id=${title}">delete</a>`);
          responseReturn(template, response);
        });
      });
      }
    }else if(pathname === '/form'){
        fs.readdir('./form', function(error, filelist){
          var url = "form/form.html";
          var title = "타이틀 생성하기";
          console.log(filelist, queryData, pathname, pathname, request.url);
          var list = fileReadlist(filelist);
          fs.readFile(url, 'utf8', function(err, description){
          var template = templateList(title, '', `<h2>${title}</h2><h2>${description}</h2>`,'');
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
          var locations = `/?id=${title}`;
          fs.writeFile(`sgmoominFile/${title}`, description, 'utf8', function(err){
            responseLocationWriteReturn(302, locations, response);
          })
      });
      responseReturn("success", response);
    } else if(pathname === '/update') {
      fs.readdir('./form', function(error, filelist){
        var url = "form/update.html";
        var title = queryData.id;
        var list = fileReadlist(filelist);
          fs.readFile(url, 'utf8', function(err, description){
          var template = templateList(title, '', `<h2>${title}</h2><h2>${description}</h2>`,
          `<a href="/form">create</a> <a href="/update?id=${title}">update</a> <a href="/delete?id=${title}">delete</a>`);
          responseReturn(template, response);
        });
      });
    } else if(pathname === '/update_form') {
      var body = '';
      request.on('data', function(data){
         body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          var locations = `/?id=${title}`;
          fs.rename(`sgmoominFile/${id}`, `sgmoominFile/${title}`, function(error){
            fs.writeFile(`sgmoominFile/${title}`, description, 'utf8', function(err){
              responseLocationWriteReturn(302, locations, response);
            })
          });
      });
      responseReturn("success", response);
    } else if(pathname === '/delete') {
      fs.readdir('./form', function(error, filelist){
        var url = "form/delete.html";
        var title = queryData.id;
        var list = fileReadlist(filelist);
          fs.readFile(url, 'utf8', function(err, description){
          var deleteText = `<h5>삭제하시려는 파일 명이 ${title} 맞나요? <br> 맞으시다면 파일명을 입력하세요<h5>`;
          var template = templateList(title, '', `${deleteText}${description}`,'');
          responseReturn(template, response);
        });
      });
    } else if(pathname == '/delete_form'){
      var body = '';
      request.on('data', function(data){
         body = body + data;
      });
      request.on('end', function(){
        var post = qs.parse(body);
        var id = post.id;
        var title = post.title;
        var locations = `/`;
        console.log("testsss", id, title, queryData.id);
        fs.unlink(`sgmoominFile/${id}`, function(error){
          responseLocationWriteReturn(302, locations, response);
        })
      });
    }else {
      responseErrorReturn(404, "Not found", response);
    }
});
app.listen(3000);
