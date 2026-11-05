const defaultFodderImg = "https://cdn-icons-png.flaticon.com/512/53/53283.png";

const seasonDatabase = [
  { code: "ICON", color: "#ffb700", ovrBoost: 8 },
  { code: "TOTY", color: "#0055ff", ovrBoost: 6 },
  { code: "NORM", color: "#adb5bd", ovrBoost: 0 }
];

const playerDatabase = [
  { name: "C. Ronaldo", img: "https://s1.fifaaddict.com/fo4/players/zllarwzny.png?20210828", salary: 26 },
      { name: "L. Messi", img: "https://s1.fifaaddict.com/fo4/players/njqpggqmj.png?20210828", salary: 26 },
      { name: "K. Mbappé", img: "https://s1.fifaaddict.com/fo4/players/dydgollwn.png?20210828", salary: 25 },
      { name: "E. Haaland", img: "https://s1.fifaaddict.com/fo4/players/opaklmdjr.png?20210828", salary: 25 },
      { name: "J. Bellingham", img: "https://s1.fifaaddict.com/fo4/players/pkvalobrj.png?20210828", salary: 24 },
      { name: "Z. Zidane", img: "https://s1.fifaaddict.com/fo4/players/ymkykpmvb.png?20210828", salary: 28 },
      { name: "R. Gullit", img: "https://s1.fifaaddict.com/fo4/players/opymozaok.png?20210828", salary: 27 },
      { name: "Pelé", img: "https://s1.fifaaddict.com/fo4/players/kjjgrbaaj.png?20210828", salary: 28 },
      { name: "K. De Bruyne", img: "https://s1.fifaaddict.com/fo4/players/opavrybzr.png?20210828", salary: 25 },
      { name: "V. van Dijk", img: "https://s1.fifaaddict.com/fo4/players/aavpqpbnk.png?20210828", salary: 25 },
      { name: "Son Heung-min", img: "https://s1.fifaaddict.com/fo4/players/vgmokmkoz.png?20210828", salary: 24 },
      { name: "Vinícius Jr.", img: "https://s1.fifaaddict.com/fo4/players/kjvaaakbk.png?20210828", salary: 25 }
    ];

function showToast(message) {
  const toast = document.getElementById('gameToast');
  toast.innerText = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
  if(tabId === 'marketTab') renderMarket();
}

function updateUI() {
  document.getElementById('bpCount').innerText = (userData.bp || 0).toLocaleString('vi-VN');
  renderMarket();
}

// Mở gói thẻ ngẫu nhiên
function openPacks(count) {
  if (!userData.inventory) userData.inventory = [];
  for (let i = 0; i < count; i++) {
    const p = playerDatabase[Math.floor(Math.random() * playerDatabase.length)];
    const s = seasonDatabase[Math.floor(Math.random() * seasonDatabase.length)];
    const ovr = 105 + s.ovrBoost;
    userData.inventory.push({ id: Date.now() + Math.random(), name: p.name, season: s.code, seasonColor: s.color, ovr: ovr, img: p.img });
  }
  authSaveData();
  updateUI();
  showToast(`Đã nhận ${count} cầu thủ vào kho!`);
}

// Hiển thị danh sách cầu thủ để chọn bán
function renderMarket() {
  const tbodyMy = document.getElementById('myMarketTable');
  tbodyMy.innerHTML = '';
  
  if (!userData.inventory || userData.inventory.length === 0) {
    tbodyMy.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #666;">Kho trống không có cầu thủ nào để bán.</td></tr>`;
    return;
  }

  userData.inventory.forEach((item, index) => {
    const sellPrice = item.ovr * 1000000000;
    tbodyMy.innerHTML += `
      <tr>
        <td><input type="checkbox" class="player-checkbox" value="${index}"></td>
        <td>
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${item.img || defaultFodderImg}" style="width:30px; height:30px; object-fit:contain;">
            <span>${item.name}</span>
          </div>
        </td>
        <td><span style="background:${item.seasonColor}; color:#000; padding:1px 4px; border-radius:3px; font-size:9px; font-weight:bold;">${item.season}</span></td>
        <td style="color: var(--accent-gold);">${item.ovr}</td>
        <td>${(sellPrice / 1e9).toFixed(1)}B BP</td>
      </tr>
    `;
  });
}

// Chọn tất cả checkbox
function toggleSelectAll(master) {
  const checkboxes = document.querySelectorAll('.player-checkbox');
  checkboxes.forEach(cb => cb.checked = master.checked);
}

// Chức năng BÁN NHIỀU cầu thủ đã chọn cùng lúc
function sellSelectedPlayers() {
  const checkboxes = document.querySelectorAll('.player-checkbox:checked');
  if (checkboxes.length === 0) {
    showToast("Vui lòng chọn ít nhất một cầu thủ để bán!");
    return;
  }

  // Lấy danh sách index cần xóa (sắp xếp từ lớn đến nhỏ để tránh lệch index khi splice)
  const indicesToRemove = Array.from(checkboxes).map(cb => parseInt(cb.value)).sort((a, b) => b - a);
  
  let totalEarned = 0;
  indicesToRemove.forEach(index => {
    const item = userData.inventory[index];
    const price = item.ovr * 1000000000;
    totalEarned += price;
    userData.inventory.splice(index, 1); // Xóa khỏi kho
  });

  userData.bp += totalEarned;
  authSaveData();
  updateUI();
  showToast(`Đã bán ${indicesToRemove.length} cầu thủ, thu về ${(totalEarned / 1e9).toFixed(1)} Tỷ BP!`);
}
