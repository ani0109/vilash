// const tgId = 'TG0030';
// const port = {
//     rpm: '00',
//     moisture: '01',
//     sandMoisture: '02',
//     gps: '03',
//     vfd1: '04',
//     vfd2: '05',
//     camera: '06'
// };
// //------------------------for developer--------------------------
// const mqttHostname = '119.81.0.44';
// const mqttPort = 9001;
// const sliderDuration = 2000;

// //------------------------------mqttconnection
// let clientid = 'myclientid_' + parseInt(Math.random() * 100, 10);
// let client = new Paho.MQTT.Client(mqttHostname, mqttPort, clientid);
// client.onConnectionLost = responseObject =>
//     alert('connection lost: ' + responseObject.errorMessage);
// client.connect({
//     onSuccess: () => {
//         console.log('connected to clientid : ' + clientid);
//         client.subscribe(`oee/counter/${tgId}`); //this has to be here to get update the console for the latest oee data
//         client.subscribe(`oee/idle/${tgId}`); //this is to flip
//         client.subscribe(`oee/unidle/${tgId}`); //this is to unflip
//         client.subscribe(`oee/start/${tgId}`); //this is to start
//         client.subscribe(`oee/stop/${tgId}`); //this is to stop
//         client.subscribe(`oee/pause/${tgId}`); //this is to pause
//         client.subscribe(`oee/startM/${tgId}`); //this is to startMachine
//         client.subscribe(`oee/stopM/${tgId}`); //this is to stopMachine
//         client.subscribe(`oee/device/dead/${tgId}`); //this is to make alert that device is dead
//         client.subscribe(`oee/device/birth/${tgId}`); //this is to make alert that device is birth
//         client.subscribe(`sensor/${tgId}_${port.rpm}`);
//         // client.subscribe(`sensor/${tgId}_${port.proximity}`);
//         client.subscribe(`sensor/${tgId}_${port.moisture}`);
//         client.subscribe(`sensor/${tgId}_${port.sandMoisture}`);
//         client.subscribe(`sensor/${tgId}_${port.gps}`);
//         client.subscribe(`sensor/${tgId}_${port.vfd1}`);
//         client.subscribe(`sensor/${tgId}_${port.vfd2}`);
//         client.subscribe(`sensor/${tgId}_${port.camera}`);
//         console.log('Subscribed');
//     },
//     onFailure: message => alert('Connection failed: ' + message.errorMessage)
// });

// client.onMessageArrived = m => {
//     switch (true) {
//         /*     case message.destinationName == `oee/idle/${tgId}`:
//           break;
//         case message.destinationName == `oee/unidle/${tgId}`:
//           break; */
//         case m.destinationName == `sensor/${tgId}_${port.rpm}`:
//             let data = JSON.parse(m.payloadString);
//             Object.keys(data).forEach(e => {
//                 if (e == 'distance') {
//                     $('.distance').text(
//                         (
//                             parseFloat(
//                                 $('.distance')
//                                     .text()
//                                     .split(' ')[0]
//                             ) +
//                             2 * 3.14 * data[e]
//                         ).toFixed(2) + 'm'
//                     );
//                 } else {
//                     $('.speed').text(data[e] + 'm/sec');
//                 }
//             });
//             break;
//         case m.destinationName == `sensor/${tgId}_${port.moisture}`:
//             $('.moisture').text(m.payloadString + '%');
//             break;
//         case m.destinationName == `sensor/${tgId}_${port.sandMoisture}`:
//             $('.sandMoisture').text(JSON.parse(m.payloadString).moisture + '%');
//             break;
//         default:
//             break;
//     }
// };

// function vfd1(e) {
//     e.preventDefault();
//     var message = new Paho.MQTT.Message($('.rfreqvfd1').val() + '00');
//     message.destinationName = 'vfd1/TG0030_05/rfreq';
//     // message.qos = qos;
//     client.send(message);
// }
// function vfd2() { }




//camera
// Create h264 player
console.log(document.location.host);
var uri = "ws://" + document.location.host;
var canvas = document.createElement("canvas");
$('.camera').append(canvas);
var wsavc = new WSAvcPlayer(canvas, "webgl", 1, 35);
wsavc.connect(uri);

//expose instance for button callbacks
// window.wsavc = wsavc;
setTimeout(() => {
    wsavc.playStream();
}, 2000);
