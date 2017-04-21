const Sensor = require('../models').Sensor;
const Entry = require('../models').Entry;
const User = require('../models').User;

module.exports = {
  create(req, res) {
    return Sensor
      .create({
        ipaddress: req.body.ipaddress,
        userId: req.params.uid
      })
      .then(sensor => res.status(201).send(sensor))
      .catch(error => res.status(400).send(error));
  },

  list(req, res) {
    return Sensor
      .all({
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensors => res.status(200).send(sensors))
      .catch(error => res.status(400).send(error));
  },

  getSensorById(req, res) {
    return Sensor
      .findById(req.params.sid, {
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return res.status(200).send(sensor);
      })
      .catch(error => res.status(400).send(error));
  },

  getSensorByIP(req, res) {
    return Sensor
      .findOne({ where: {ipaddress: req.params.ip},
        include: [{
          model: Entry,
          as: 'entries',
        }],
        order: [
            [
              {model: Entry, as:'entries'},
              'id',
              'DESC'
            ]
        ]
      })
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return res.status(200).send(sensor);
      })
      .catch(error => res.status(400).send(error));
  },

  getLatestSensorReadingsForUser(req, res) {
    Sensor
      .findAll({
        where: {
          userId: req.params.uid
        }
      })
      .map(sensor =>
        Entry.findOne({
          where: {
            sensorId: sensor.id
          },
          order: [
            ['id', 'DESC']
          ]
        }))
      .then(entries => {
        return res.status(200).send(entries
          .sort(function(entry1, entry2) {
            return entry1["sensorId"]-entry2["sensorId"] // sort entries by increasing
          })
        );
      })
  },


  getSensorByIdDay(req, res) {
  return Sensor
    .findById(req.params.sid, {
      include: [{
        model: Entry,
        as: 'entries',

      } ],
      order: [
          [
            {model: Entry, as:'entries'},
            'id',
            'DESC'
          ]
      ],
      limit:  1440,
      subQuery: false
    })
    .then(sensor => {
      if (!sensor) {
        return res.status(404).send({
          message: 'Sensor Not Found',
        });
      }
      //console.log(JSON.stringify(sensor['entries']));
      var entries = sensor['entries'];
      var avgEntries = [];
      var humAvg = 0;
      var tempAvg = 0;
      var sunAvg = 0;
      var moistAvg = 0;
      for (var i in entries){
          if((parseInt(i)+1)%60==0){
              humAvg = (humAvg+entries[i]['humidity'])/60;
              tempAvg = (tempAvg+entries[i]['temperature'])/60;
              sunAvg = (sunAvg+entries[i]['sunlight'])/60;
              moistAvg = (moistAvg+entries[i]['moisture'])/60;
              avgEntries.push({"humidity":humAvg,"temperature":tempAvg,"sunlight":sunAvg, "moisture":moistAvg})
          }else{
              //console.log((int(i)+1)%60);
              console.log((parseInt(i)+1)%60 );
              humAvg = humAvg+entries[i]['humidity'];
              tempAvg = tempAvg+entries[i]['temperature'];
              sunAvg = sunAvg+entries[i]['sunlight'];
              moistAvg = moistAvg+entries[i]['moisture'];
          }
      }
      return res.status(200).send(avgEntries);
    })
    .catch(error => res.status(400).send(error));
},

  update(req, res) {
    return Sensor
      .findById(req.params.sid)
      .then(sensor => {
        if (!sensor) {
          return res.status(404).send({
            message: 'Sensor Not Found',
          });
        }
        return sensor
          .update({
            ipaddress: req.body.ipaddress || sensor.ipaddress,
            name: ((req.body.name == "") ? null : req.body.name),
          })
          .then(() => res.status(200).send(sensor))  // Send back the updated sensor.
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },

  destroy(req, res) {
    return Sensor
      .findById(req.params.sid)
      .then(sensor => {
        if (!sensor) {
          return res.status(400).send({
            message: 'Sensor Not Found',
          });
        }
        return sensor
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
};
