const request = require('request');
const config = require('../config');
const oeeSchema = require('../models/oeeSchema');
const dataSchema = require('../models/dataSchema');
let oeeReady = true;
let sensorReady = true;

function sendData(sw) {
  if (oeeReady) {
    oeeReady = false;
    oeeSchema
      .findOne({})
      .then(data => {
        if (data.status == 'stopped') {
          request.post(
            `${config.oee_api}/offline`,
            {
              json: data
            },
            (error, response, body) => {
              if (error) {
                console.log(error);
                oeeReady = true;
              }
              if (body.status == 'done') {
                dataSchema
                  .findByIdAndDelete(data._id)
                  .then(result => (oeeReady = true))
                  .catch(err => {
                    console.log(err);
                    oeeReady = true;
                  });
              }
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
        oeeReady = true;
      });
  }
  if (sensorReady) {
    sensorReady = false;
    dataSchema
      .find()
      .limit(2)
      .then(data => {
        if (data.length >= 2) {
          request.post(
            `${config.sensor_api}/offline`,
            {
              json: data[0]
            },
            (error, response, body) => {
              if (error) {
                console.log(error);
                sensorReady = true;
              }
              if (body.status == 'done') {
                dataSchema
                  .findByIdAndDelete(data[0]._id)
                  .then(result => (sensorReady = true))
                  .catch(err => {
                    console.log(err);
                    sensorReady = true;
                  });
              }
            }
          );
        }
      })
      .catch(err => {
        console.log(err);
        sensorReady = true;
      });
  }
}

module.exports = sendData;
