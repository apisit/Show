
var sys = require( "sys" );
var http = require( "http" );
var url = require( "url" );
var path = require( "path" );
var fileSystem = require( "fs" );
 
 
// ---------------------------------------------------------- //
// ---------------------------------------------------------- //
 
 
// Create an instance of the HTTP server.
var server = http.createServer(
function( request, response ){
 
// Get the requested "script_name". This is the part of the
// path after the server_name.
var scriptName = request.url;
 
// Convert the script name (expand-path) to a physical file
// on the local file system.
var requestdFilePath = path.join( process.cwd(), scriptName );
 
// Read in the requested file. Remember, since all File I/O
// (input and output) is asynchronous in Node.js, we need to
// ask for the file to be read and then provide a callback
// for when that file data is available.
//
// NOTE: You can check to see if the file exists *before* you
// try to read it; but for our demo purposes, I don't see an
// immediate benefit since the readFile() method provides an
// error object.
fileSystem.readFile(
requestdFilePath,
"binary",
function( error, fileBinary ){
 
// Check to see if there was a problem reading the
// file. If so, we'll **assume** it is a 404 error.
if (error){
 
// Send the file not found header.
response.writeHead( 404 );
 
// Close the response.
response.end();
 
// Return out of this guard statement.
return;
 
}
 
// If we made it this far then the file was read in
// without a problem. Set a 200 status response.
response.writeHead( 200 );
 
// Serve up the file binary data. When doing this, we
// have to set the encoding as binary (it defaults to
// UTF-8).
response.write( fileBinary, "binary" );
 
// End the response.
response.end();
 
}
);
 
}
);
 
// Point the server to listen to the given port for incoming
// requests.
server.listen( 8080 );
 
 
// ---------------------------------------------------------- //
// ---------------------------------------------------------- //
 
 
// Create a local memory space for further now-configuration.
(function(){
 
// Now that we have our HTTP server initialized, let's configure
// our NowJS connector.
var nowjs = require( "now" );
 
 
// After we have set up our HTTP server to serve up "Static"
// files, we pass it off to the NowJS connector to have it
// augment the server object. This will prepare it to serve up
// the NowJS client module (including the appropriate port
// number and server name) and basically wire everything together
// for us.
//
// Everyone contains an object called "now" (ie. everyone.now) -
// this allows variables and functions to be shared between the
// server and the client.
var everyone = nowjs.initialize( server );
 
 
// Create primary key to keep track of all the clients that
// connect. Each one will be assigned a unique ID.
var primaryKey = 0;
 
 var lineDB=[];
// When a client has connected, assign it a UUID. In the
// context of this callback, "this" refers to the specific client
// that is communicating with the server.
//
// NOTE: This "uuid" value is NOT synced to the client; however,
// when the client connects to the server, this UUID will be
// available in the calling context.
everyone.connected(
function(){
console.log(this.user.clientId);
}
);

 everyone.on("disconnect", function(){
   console.log("Left: " + this.now.uuid);
 });

 
 everyone.now.sendToServer=function(lines){
  everyone.exclude([this.user.clientId]).now.remoteDraw(lines);
 };
 


 
})();
 
 
// ---------------------------------------------------------- //
// ---------------------------------------------------------- //
 
 
// Write debugging information to the console to indicate that
// the server has been configured and is up and running.
sys.puts( "Server is running1111 on 8080" );