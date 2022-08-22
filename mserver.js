const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccount.json");
const port = process.env.PORT;
const io = require("socket.io")(port, {
  //8123 is the local port we are binding the demo server to
  pingInterval: 30005, //An interval how often a ping is sent
  pingTimeout: 5000, //The time a client has to respont to a ping before it is desired dead
  upgradeTimeout: 3000, //The time a client has to fullfill the upgrade
  allowUpgrades: true, //Allows upgrading Long-Polling to websockets. This is strongly recommended for connecting for WebGL builds or other browserbased stuff and true is the default.
  cookie: false, //We do not need a persistence cookie for the demo - If you are using a load balöance, you might need it.
  serveClient: true, //This is not required for communication with our asset but we enable it for a web based testing tool. You can leave it enabled for example to connect your webbased service to the same server (this hosts a js file).
  allowEIO3: false, //This is only for testing purpose. We do make sure, that we do not accidentially work with compat mode.
  cors: {
    origin: "*", //Allow connection from any referrer (most likely this is what you will want for game clients - for WebGL the domain of your sebsite MIGHT also work)
  },
});
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const userCollection = db.collection("users");

console.log("Starting Socket.IO demo server");

io.on("connection", (socket) => {
  console.log("Game Connected");
  socket.on("unique_code", async (data) => {
    const unique_code = data;
    console.log("Hello");
    console.log("Unique code is " + unique_code);
    //const docRef = db.collection('users').doc(unique_code);

    socket.on("Game_Session_Data", async (payload2) => {
      console.log("current payload context is " + unique_code);      
      
      var string1 = JSON.stringify(payload2);
      var payload = JSON.parse(string1);      
      console.log("Following perfect json:")
      console.log(payload)    
      data={
        "calories":payload.calories,
        
        "coins":payload.coins,
        
        "score":payload.score,
        
        "time":payload.time, 
        "dateTime": payload.dateTime               
      }
     console.log( result)
     await userCollection
       .doc(unique_code.toString())
       .update({ t: FieldValue.arrayUnion(data)});
       await userCollection
       .doc(unique_code.toString())
       .update({ sessions: FieldValue.arrayUnion(payload.dateTime)});
      //await userCollection.doc(unique_code.toString()).set(payload);
    });
  //  socket.on("isEveryday",async (data)=>{
  //    await userCollection.doc(unique_code).ge
  //  });
  });
});




async function getData(){
  l=[];
  const d= userCollection.doc("rZ7xk6kWgXcSjtFZ5BVr401bEQr2")
  const data = await d.get()
  sessions_array=data.data().sessions
  console.log(sessions_array)
  for(var i in sessions_array){
    const timing=sessions_array[i]
    
    const fireBaseTime = new Date(
      timing.seconds * 1000 + timing.nanoseconds / 1000000,
    );
    const date = fireBaseTime.toDateString();
    const atTime = fireBaseTime.toLocaleTimeString();
    console.log(date+" "+atTime.datetime);
    console.log(fireBaseTime.getFullYear())
    l.push(date+" "+atTime)
  }
 console.log(l)
}
//getData();
// let time = {
//   seconds:  1661414937,
//   nanoseconds: 383000000, 
// }

// workFrom = "11:40";
// time = new Date("1/02/1970" + " " + workFrom);
// console.log(time.getMonth())
// console.log(time.getDate() +'/'+ time.getMonth() +'/'+ time.getFullYear()+ ' '+ time.getHours() + ':' + time.getMinutes());


var dT=  '08-22-2022 15:15:44'
var dt2= '08-23-2022 15:15:44'
//get the session_array
//if session_arr.lenght=2, empty it and set the new session_arr,,, else just set it
//get the session_array
//['08-22-2022 15:15:44','08-23-2022 17:18:49']
//check everyday: loop through and convert each to Date format
///var diff = Math.abs(new Date() - compareDate);
//subtract 
// time= new Date(dT)
// time1=new Date(dt2)
// var dif = Math.abs(time-time1)
// console.log(dif/ 3600000)

//console.log(time.getDate() +'/'+ time.getMonth() +'/'+ time.getFullYear()+ ' '+ time.getHours() + ':' + time.getMinutes());