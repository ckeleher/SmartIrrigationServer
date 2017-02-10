const entriesController = require('../controllers').entry;
const sensorsController = require('../controllers').sensor;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Smart Irrigation API!',
  }));

  app.post('/api/sensors', sensorsController.create); //create sensor
  app.get('/api/sensors/all', sensorsController.list); // list all sensors
  app.get('/api/sensors/:sid', sensorsController.getSensor); // retrieve sensor + entries
  app.post('/api/sensors/:sid/entries', entriesController.create); // create entry for sensor
  app.put('/api/sensors/:sid', sensorsController.update); // update sensor fields
  app.delete('/api/sensors/:sid', sensorsController.destroy); // delete sensor
};