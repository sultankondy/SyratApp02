const prayTimes = require('../../statics/prayTime'); 
const http = require('http'); 
const axios = require('axios');

const googleMapsClient = require('@google/maps').createClient({
    key: process.env.GOOGLE_MAP_API_KEY
});
let currentLocation;
  
(async () => {
  currentLocation = await getCurrentLocation();
})();

//CONTROLLERS START
const getCurrentYearScheduleByMonth = (req, res) => {
    res.json(timesForMonth(req));
}

const getCurrentDaySchedule = (req, res) => {
    res.json(currentDaySchedule(req));
}

const getQiblaDirection = (req, res) => {
    res.json(qiblaDirection());

}

const getGeolocation = (req, res) => {
    getCurrentLocation().then((location) => {
        res.send(location);
    })
}

const getHolidays = (req, res) => {
    res.json(holidays())
}

const getDailyAyahByRandom = (req, res) => {
    res.send(getQuranAyahRandom())
    console.log(getQuranAyahRandom())
}
  
//CONTROLLERS END


// FUNCTIONS START
const timesForMonth = (req) => {
    if(req.query.kmdb){
        prayTimes.setMethod('ISNA');
    }else{
        prayTimes.setMethod(req.query.method); // MWL, ISNA, Egypt, Makkah, Karachi, Tehran, Jafari
    }
    prayTimes.adjust({asr: req.query.asr}); // Hanafi or Standard
    prayTimes.adjust( {highLats: req.query.highLats} ); // 'NightMiddle','AngleBased', 'OneSeventh', 'None'

    var date = new Date();
    var month = date.getMonth();
    switch(req.params.month){
        case 'january': month = 0
        break;        
        case 'february': month = 1
        break;        
        case 'march': month = 2
        break;        
        case 'april': month = 3
        break;        
        case 'may': month = 4
        break;        
        case 'june': month = 5
        break;        
        case 'july': month = 6
        break;        
        case 'august': month = 7
        break;        
        case 'september': month = 8
        break;        
        case 'october': month = 9
        break;        
        case 'november': month = 10
        break;        
        case 'december': month = 11
        break;

    }

    date.setMonth(month);
    var startdate = new Date(date.getFullYear(), date.getMonth(), 1);
    var endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const c1 = Number(currentLocation.lat)
    const c2 = Number(currentLocation.lng)
    const currentDate = new Date();
    const timezone = (currentDate.getTimezoneOffset() / 60) >= 0 ? (currentDate.getTimezoneOffset() / 60) : -(currentDate.getTimezoneOffset() / 60);

    var list = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    var times1=[];
    var t=0;
    while(startdate <= endDate) {
        const temp = prayTimes.getTimes(startdate, [c1, c2], timezone, 'auto','24h');
        times1[t] = [];
        for(var k=0;k<6;k++) {
            times1[t][k] = temp[list[k]];
        }
        times1[t]['date'] = ((t+1)<10?'0'+(t+1):(t+1))+'/'+((month+1)<10?'0'+(month+1):(month+1)) + "/" + date.getFullYear();
        startdate.setDate(startdate.getDate()+1);
        t++;
    }

    var result_1 = [];
    for(var k in times1) {
        result_1[k]=[];
        for(var i=0;i<6;i++) {
            var add = 0;
            if(req.query.kmdb) {
                if(c1<48) {
                    if(i==1) add-=3;
                    else if(i>1 && i<5) add+=3;
                } else {
                    if(i===1) add-=5;
                    else if(i>1 && i<5) add+=5;
                }
            }
            var arr = times1[k][i].split(':');
            var date1 = new Date('2016/11/9 '+times1[k][i]);
            date1.setMinutes(date1.getMinutes() + add);
            var h=date1.getHours();
            var min=date1.getMinutes();
            result_1[k][i] = (h<10?'0'+h:parseInt(h))+':'+(min<10?'0'+min:parseInt(min));
        }
        result_1[k][6] = times1[k]['date'];  
    }
    

    var total_result = {}
    for(var i=0;i<result_1.length;i++){
        var day_result = {};
        for (var j=0;j<list.length;j++) {
            day_result[list[j]] = result_1[i][j];
        }
        day_result['date'] = result_1[i][6];
        total_result[i] = day_result
    }
    return total_result;
}

const currentDaySchedule = (req) => {
    var timeForMonth = timesForMonth(req);
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    var currentDate = dd + '/' + mm + '/' + yyyy;
    var result = {};
    for(let i = 0;i<Object.keys(timeForMonth).length;i++){
        if(timeForMonth[i]['date'] === currentDate){
            result['time'] = timeForMonth[i];
            break;
        }
    }
    return result;
}

const qiblaDirection = (req) => {
    const userLocation = {
        latitude: currentLocation.lat,
        longitude: currentLocation.lng
    }

    var bearTo = bearingTo(userLocation.latitude, userLocation.longitude);
    if (bearTo < 0) {
        bearTo = bearTo + 360;
    }
    const bear = {angle: bearTo};
    return bear;
}
 
function bearingTo(latitude, longitude) {
    const kaabaLatitude = 21.4225; // latitude of the Kaaba
  const kaabaLongitude = 39.8262; // longitude of the Kaaba
  
  const latitudeRad = (latitude * Math.PI) / 180; // convert latitude to radians
  const longitudeRad = (longitude * Math.PI) / 180; // convert longitude to radians
  const kaabaLatitudeRad = (kaabaLatitude * Math.PI) / 180; // convert Kaaba latitude to radians
  const kaabaLongitudeRad = (kaabaLongitude * Math.PI) / 180; // convert Kaaba longitude to radians
  
  const y = Math.sin(kaabaLongitudeRad - longitudeRad);
  const x = Math.cos(latitudeRad) * Math.tan(kaabaLatitudeRad) - Math.sin(latitudeRad) * Math.cos(kaabaLongitudeRad - longitudeRad);
  const qiblaDirection = Math.atan2(y, x);
  
  const qiblaDirectionDeg = (qiblaDirection * 180) / Math.PI; // convert Qibla direction to degrees
  return qiblaDirectionDeg;
}

async function getCurrentLocation() {
    try {
      const response = await new Promise((resolve, reject) => {
        googleMapsClient.geolocate({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        });
      });
      const lat = response.json.location.lat;
      const lng = response.json.location.lng;
      const currentLocation = { lat, lng };
      return currentLocation;
    } catch (err) {
      console.log(err);
    }
}

function holidays(){
    const HijriDate = require('hijri-date').default;
    const holidays = require('../../statics/holiday.json'); 
	const today = new HijriDate();    
	let nextHoliday = null;
	for (let i = 0; i < holidays.length; i++) {
	  const holiday = holidays[i];
	  const holidayDate = new HijriDate(today.year, holiday.hijriMonth - 1, holiday.hijriDay);
	  if (holidayDate > today) {
	    nextHoliday = holiday;
	    break;
	  }
	}
    // Create an array of holidays starting from the next holiday
	const holidayYear = nextHoliday ? today.year : today.year + 1;
	const remainingHolidays = nextHoliday
	  ? holidays.slice(holidays.indexOf(nextHoliday)-2)
	  : holidays;
	const holidaysThisYear = remainingHolidays.map(holiday => {
	  const holidayDate = new HijriDate(holidayYear, holiday.hijriMonth - 1, holiday.hijriDay);
	  return {
	    title: holiday.title,
        hijriMonthName: holiday.hijriMonthName,
        holidayDate: holidayDate,
	    date: holidayDate.toGregorian(),
	  };
	});

    // Add the holidays of the following year
	var holidaysNextYear = holidays.map(holiday => {
        const holidayDate = new HijriDate(holidayYear + 1, holiday.hijriMonth - 1, holiday.hijriDay);
        return {
            title: holiday.title,
            hijriMonthName: holiday.hijriMonthName,
            holidayDate: holidayDate,
            date: holidayDate.toGregorian(),
        };
    });

    holidaysNextYear = holidaysNextYear.slice(holidaysThisYear.length);
    const allHolidays = [...holidaysThisYear, ...holidaysNextYear].sort((a, b) => a.date - b.date);

    return allHolidays;

}

const getQuranAyahRandom = async () => {
    // https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/55.json
    const maxSuraForCdn = 114;
    const randomSura = Math.floor(Math.random() * maxSuraForCdn) + 1;
    const respSura = await axios.get(`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/${randomSura}.json`);
    const maxAyahOfSuraForCdn = respSura.data.total_verses;
    const randomAyah = Math.floor(Math.random() * maxAyahOfSuraForCdn) + 1;
    const respAyah = respSura.data.verses[randomAyah]
    const response = await axios.get(`http://api.alquran.cloud/v1/ayah/${randomSura}:${randomAyah}`);
    var dictionary = response.data.data; 
    dictionary['text'] = respAyah.text;
    dictionary['translation'] = respAyah.translation;
    //console.log(dictionary)
    return dictionary;
}
// FUNCTIONS END


module.exports = {
    getCurrentYearScheduleByMonth,
    getCurrentDaySchedule,
    getQiblaDirection,
    getGeolocation,
    getHolidays,
    getDailyAyahByRandom
}
