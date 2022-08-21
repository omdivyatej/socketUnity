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
      //console.log(payload);
      //console.log(typeof payload);
      var payload = JSON.parse(payload2);
      // var payload1={ calories: 45, score: 34, time: 3221, coins: 66 }
      // const result = Object.entries(payload1);
      data={
        "calories":payload.calories,
        
        "coins":payload.coins,
        
        "score":payload.score,
        
        "time":payload.time,
        
      }
      console.log( result)
      await userCollection
        .doc(unique_code.toString())
        .update({ t: FieldValue.arrayUnion(data)});
      await userCollection.doc(unique_code.toString()).set(payload);
    });
  });
});

// var payload1={ calories: 45, score: 34, time: 3221, coins: 66 }
// console.log(JSON.parse(payload1))
// var k = new Map(JSON.parse(JSON.stringify(payload1)))
// console.log(k)
// var map = {};
//       for (var value in payload1) {
//         map.(value, payload1[value]);
//       }
// print(map)
// const map = new Map([
//   ['name', 'Tom'],
//   ['country', 'Chile'],
// ]);

// // ✅ Convert to JSON string
// const json = JSON.stringify(Object.fromEntries(map));

// // 👇️ '{"name": "Tom", "country": "Chile"}'
// console.log(json);

// let jsonObject = { one: "value1", "two": "value2", "three": "value3" };  

// const result = Object.entries(jsonObject);

// console.log( result)

var payload1={ calories: 45, score: 34, time: 3221, coins: 66 }
console.log(payload1.calories)
      const result = Object.entries(payload1);

      console.log(result)

