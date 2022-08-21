const port = process.env.PORT
const io = require('socket.io')(port, { //8123 is the local port we are binding the demo server to
  pingInterval: 30005,		//An interval how often a ping is sent
  pingTimeout: 5000,		//The time a client has to respont to a ping before it is desired dead
  upgradeTimeout: 3000,		//The time a client has to fullfill the upgrade
  allowUpgrades: true,		//Allows upgrading Long-Polling to websockets. This is strongly recommended for connecting for WebGL builds or other browserbased stuff and true is the default.
  cookie: false,			//We do not need a persistence cookie for the demo - If you are using a load balöance, you might need it.
  serveClient: true,		//This is not required for communication with our asset but we enable it for a web based testing tool. You can leave it enabled for example to connect your webbased service to the same server (this hosts a js file).
  allowEIO3: false,			//This is only for testing purpose. We do make sure, that we do not accidentially work with compat mode.
  cors: {
    origin: "*"				//Allow connection from any referrer (most likely this is what you will want for game clients - for WebGL the domain of your sebsite MIGHT also work)
  }
});

console.log('Starting Socket.IO pingpong server');

const mysql = require('mysql');

function get_Connection(){
  return mysql.createConnection({
    user: "u842206977_nikhil123",
    host: "217.21.84.154",
    password: "N6^;G/]WEE]q",
    database: "u842206977_mazed123",
})
}

//This funciton is needed to let some time pass by between conversation and closing. This is only for demo purpose.
function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

// App Code starts here

console.log('Starting Socket.IO demo server');

io.on('connection', (socket) => {
	console.log('[' + (new Date()).toUTCString() + '] game connecting');

    socket.on('unique_code', async (data) => {
		    const unique_code = data;
        console.log(unique_code);
        var conn = get_Connection();
        conn.connect( function(){
          conn.query(
            "SELECT * FROM GameData WHERE Email = ?",
            [unique_code],
            (err, result) => {
            if (err){
              console.log(err);
              throw err;
            }else{
                console.log(result[0]);
                console.log("Om hai");
                socket.emit('player_data', result[0]);
            }
            conn.end()
            }
          );
        })
    });
  
  socket.on('data_received',(data) => {
    console.log("Data Retrieved!");
  })
	
	socket.on('disconnect', (data) => {
		console.log('[' + (new Date()).toUTCString() + '] Bye, client ' + socket.id);
	});
		
});

