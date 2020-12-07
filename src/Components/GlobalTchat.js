
var http = require('http');
//var fs = require('fs');
var url = require('url');
var path = require('path');
/*
let GlobalTchatSelector = document.querySelector("#tchatGlobal")
const GlobalTchat = ()=>{
    let GlobalTchathtml = `<!--Tchat-->
    
      <div id="tchat_content"></div>
      <form id= "formular" methode="post" action"#">
        <div>
          <input type="text" name="tchat_message" id="tchat_message"/>
          <input type="submit" value="Envoyer"/>
        </div>
      </form>
      <!--script src="socket.io/socket.io.js"></script-->
      <script>
        var socket = io.connect('http://localhost:8080', {query: 'pseudo = zac'});
        $("form").submit(function(){
          socket.emit("addMessage",$("#tchat_message").val())
          $("#tchat_message").val('');
          return false;
        });
        socket.on("newMessage", function(message){
          $("#tchat_content").append("<div classe='message'>"+message+"</div>");
        });
      </script>
    `;
    return GlobalTchatSelector.innerHTML = GlobalTchathtml;
}
*/

/*var server = http.createServer(function(req, res) {
    var page = url.parse(req.url).pathname;
    var filePath = path.join(__dirname,page);

    if(page === "/")
    {
        fs.readFile("index.html", 'utf-8', function(error, content){
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content);
        });
    }
    else
    {
        fs.readFile(filePath, 'utf-8', function(error, content){
            res.end(content);
        });
    }
});
var io = require('socket.io').listen(server);

io.on('connection', function(socket){
    console.log(socket.request._query.pseudo);
    console.log('connection établie');
    socket.on('addMessage',function(data){
        console.log(data);
        io.emit("newMessage", data);
    })
});
server.listen(8080);
*/

//export default GlobalTchat;