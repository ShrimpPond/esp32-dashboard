// ==========================
// 1️⃣ Dual Ring Gauge
// ==========================
 // 1. เริ่มต้นไอคอน Lucide
    lucide.createIcons();

    // 2. ตั้งค่าและฟังก์ชันของเกจ
    const MAX_TEMP = 50;   
    const MAX_HUMID = 100; 
    const RADIUS = 62;     // ขนาดรัศมี
    const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 389.55

    // ตัวแปรเก็บค่าปัจจุบัน
    let currentTemp = 28;
    let currentHumid = 62;

    function updateGaugeDisplay() {
        // อัปเดตเกจ Temp
        const tempOffset = CIRCUMFERENCE - (currentTemp / MAX_TEMP) * CIRCUMFERENCE;
        const tempRing = document.getElementById('ring-temp');
        if(tempRing) tempRing.style.strokeDashoffset = tempOffset;
        document.getElementById('val-temp').innerText = currentTemp.toFixed(1);

        // อัปเดตเกจ Humid
        const humidOffset = CIRCUMFERENCE - (currentHumid / MAX_HUMID) * CIRCUMFERENCE;
        const humidRing = document.getElementById('ring-humid');
        if(humidRing) humidRing.style.strokeDashoffset = humidOffset;
        document.getElementById('val-humid').innerText = currentHumid.toFixed(0);
    }

    // 4. ลูปจำลองการทำงาน (Simulation Loop)
    // *** ในการใช้งานจริง ลบส่วนนี้ออกและแทนที่ด้วยการรับค่าจาก MQTT หรือ API ***
    setInterval(() => {
        // สุ่มค่าขยับขึ้นลงเล็กน้อย
        currentTemp = Math.min(Math.max(currentTemp + (Math.random() - 0.5), 20), 40);
        currentHumid = Math.min(Math.max(currentHumid + (Math.random() - 0.5) * 2, 40), 90);
        
        updateGaugeDisplay();
    }, 2000);

    // เรียกทำงานครั้งแรก
    updateGaugeDisplay();


// ==========================
// 2️⃣ สถานะ Online/Offline
// ==========================
const statusEl = document.querySelector('.status');
const dotEl = statusEl.querySelector('.dot');
const textEl = statusEl.querySelector('.status-text');

function setStatus(isOnline) {
  if (isOnline) {
    dotEl.classList.remove('offline');
    dotEl.classList.add('online');
    textEl.textContent = "Online";
  } else {
    dotEl.classList.remove('online');
    dotEl.classList.add('offline');
    textEl.textContent = "Offline";
  }
}

// ตัวอย่างสลับสถานะทุก 5 วินาที
let online = true;
setInterval(() => {
  online = !online;
  setStatus(online);
}, 5000);


// ==========================
// 3️⃣ Line Chart Temp/RH
// ==========================

// เริ่มต้นข้อมูลรายวัน
// const labels = ["จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์","อาทิตย์"];
const tempData = [28, 30, 27, 29, 31, 26, 28];
const humiData = [62, 58, 65, 60, 63, 59, 61];

const ctx = document.getElementById('tempHumiChart').getContext('2d');

const tempHumiChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: tempData,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255,107,107,0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'yTemp'
      },
      {
        label: 'Humidity (%)',
        data: humiData,
        borderColor: '#4dabf7',
        backgroundColor: 'rgba(77,171,247,0.2)',
        tension: 0.4,
        fill: true,
        yAxisID: 'yHumi'
      }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { mode: 'index', intersect: false }
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      yTemp: {
        min: 0,
        max: 100,
        type: 'linear',
        position: 'left',
        ticks: { color: "#fff" },
        grid: { color: 'rgba(255,255,255,0.1)' },
        title: { display: true, text: 'Temperature (°C)', color: "#fff" }
      },
      yHumi: {
        min: 0,
        max: 100,
        type: 'linear',
        position: 'right',
        ticks: { color: "#fff" },
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Humidity (%)', color: "#fff" }
      }
    }
  }
});

// ==========================
// 3️⃣1 Real-time Update (ทุก 1 นาที)
// ==========================
function updateChart(temp, humi) {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});

  tempHumiChart.data.labels.push(timeLabel);
  tempHumiChart.data.datasets[0].data.push(temp);
  tempHumiChart.data.datasets[1].data.push(humi);

  // จำกัดข้อมูลไม่ให้เกิน 120 จุด (2 ชั่วโมง)
  if (tempHumiChart.data.labels.length > 120) {
    tempHumiChart.data.labels.shift();
    tempHumiChart.data.datasets[0].data.shift();
    tempHumiChart.data.datasets[1].data.shift();
  }

  tempHumiChart.update();
}

// ตัวอย่างอัปเดตทุก 1 นาที
setInterval(() => {
  const temp = Math.floor(20 + Math.random() * 15);
  const humi = Math.floor(40 + Math.random() * 40);
  updateChart(temp, humi);
}, 60000);

// ==========================
// 4️⃣ ฟังก์ชันตั้งค่า
// ==========================
 const settingsBtn = document.querySelector('.settings-icon');
  const settingsApp = document.getElementById('settingsApp');
  const closeSettingsApp = document.getElementById('closeSettingsApp');

  settingsBtn.addEventListener('click', () => {
    settingsApp.classList.remove('hidden');
  });

  closeSettingsApp.addEventListener('click', () => {
    settingsApp.classList.add('hidden');
  });

  document.getElementById("saveSettings").addEventListener("click", () => {

    const settingsData = {
      relayAuto: document.getElementById("relayAuto").checked,
      tempOn: document.getElementById("tempOn").value,
      tempOff: document.getElementById("tempOff").value,
      humiOn: document.getElementById("humiOn").value,
      humiOff: document.getElementById("humiOff").value,

      alertEnable: document.getElementById("alertEnable").checked,
      alertTempHigh: document.getElementById("alertTempHigh").value,
      alertTempLow: document.getElementById("alertTempLow").value,
      alertHumiHigh: document.getElementById("alertHumiHigh").value,
      alertHumiLow: document.getElementById("alertHumiLow").value,
    };

    console.log("SETTINGS:", settingsData);

    // ✅ ส่งไป ESP32 (ใช้ตอนคุณพร้อม)
    /*
    fetch("/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsData)
    });
    */

    alert("✅ Settings Saved");
  });