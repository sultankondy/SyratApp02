const router = require('express').Router();
const prayTimeController = require('./prayTime.controller');

// GET DAILY QURAN AYAH
router.get('/get-daily-quran-ayah', prayTimeController.getDailyAyahByRandom);
// GET ISLAMIC HOLIDAY
router.get('/get-holidays', prayTimeController.getHolidays)
// GET QIBLA DIRECTION
router.route('/get-qibla-direction')
    .get(prayTimeController.getQiblaDirection)
// GET CURRENT LOCATION
router.route('/get-geolocation')
    .get(prayTimeController.getGeolocation);
// GET BY MONTH
router.route("/:month")
    .get(prayTimeController.getCurrentYearScheduleByMonth)

// GET CURRENT DAY 
router.route("/")
    .get(prayTimeController.getCurrentDaySchedule);



module.exports = router;
