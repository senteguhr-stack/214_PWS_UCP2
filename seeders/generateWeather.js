const cities = require('./citiesData');

const CONDITIONS = ['cerah', 'berawan', 'hujan_ringan', 'hujan_lebat', 'badai', 'berkabut'];

function randomFloat(min, max, decimals = 1) {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(decimals));
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

/**
 * Menghasilkan data cuaca harian untuk setiap kota selama `days` hari terakhir.
 * Suhu dasar dipengaruhi elevasi (semakin tinggi elevasi, semakin sejuk) dan
 * letak lintang kota (mendekati garis khatulistiwa cenderung lebih panas & lembab),
 * supaya datanya tidak seragam / acak murni — mensimulasikan kompleksitas nyata.
 */
function generateWeatherData(days = 10) {
  const records = [];
  const today = new Date('2026-08-24'); // tanggal acuan (hari ini)

  cities.forEach((city, cityIndex) => {
    // Baseline suhu: makin tinggi elevasi, makin dingin
    const elevationCooling = city.elevationM / 100; // tiap 100m turun ~1 derajat
    const baseTempMax = 33 - elevationCooling + randomFloat(-1, 1);
    const baseTempMin = 23 - elevationCooling * 0.7 + randomFloat(-1, 1);

    // Kota dekat khatulistiwa (|lat| kecil) cenderung lebih lembap
    const humidityBase = 70 + (5 - Math.abs(city.latitude)) * 1.5;

    for (let d = 0; d < days; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

      const tempMin = parseFloat((baseTempMin + randomFloat(-1.5, 1.5)).toFixed(1));
      const tempMax = parseFloat((baseTempMax + randomFloat(-1.5, 2)).toFixed(1));
      const humidity = Math.min(99, Math.max(40, parseFloat((humidityBase + randomFloat(-10, 10)).toFixed(1))));
      const rainfall = Math.random() < 0.4 ? randomFloat(0, 45, 1) : 0;
      const windSpeed = randomFloat(3, 28, 1);

      let condition;
      if (rainfall > 25) condition = 'hujan_lebat';
      else if (rainfall > 5) condition = 'hujan_ringan';
      else if (windSpeed > 22) condition = 'badai';
      else if (humidity > 88) condition = 'berkabut';
      else condition = randomItem(['cerah', 'berawan', 'cerah']);

      records.push({
        city_id: cityIndex + 1,
        record_date: dateStr,
        temp_min_c: tempMin,
        temp_max_c: Math.max(tempMax, tempMin + 2), // pastikan max > min
        humidity_percent: humidity,
        rainfall_mm: rainfall,
        wind_speed_kph: windSpeed,
        condition,
        "createdAt": new Date(),
        "updatedAt": new Date(),
      });
    }
  });

  return records;
}

module.exports = generateWeatherData;
