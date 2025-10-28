// ==================== REPORT PAGE ====================
document.addEventListener("DOMContentLoaded", () => {
  const reportForm = document.getElementById("reportForm");
  if (reportForm) {
    reportForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("fullName").value.trim();
      const id = document.getElementById("idNumber").value.trim();
      const room = document.getElementById("roomNumber").value.trim();
      const issue = document.getElementById("issueType").value.trim();
      const description = document.getElementById("description").value.trim();

      if (!name || !id || !room || !issue) {
        alert("⚠️ Please fill all required fields before submitting!");
        return;
      }

      const report = {
        name,
        id,
        room,
        issue,
        description,
        date: new Date().toLocaleString(),
      };

      const reports = JSON.parse(localStorage.getItem("reports")) || [];
      reports.push(report);
      localStorage.setItem("reports", JSON.stringify(reports));

      const msg = document.getElementById("successMsg");
      if (msg) {
        msg.style.display = "block";
        setTimeout(() => (msg.style.display = "none"), 2000);
      }

      this.reset();
    });
  }
});


// ==================== HOME PAGE ====================
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search2");
  const rooms = document.querySelectorAll(".room");
  const mainPage = document.querySelector(".mainPage");
  const floorTitles = document.querySelectorAll(".floor-title");

  if (!mainPage) return; // stop if not on home page

  // Search filter
  searchInput?.addEventListener("keyup", (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    rooms.forEach((room) => {
      room.style.display = room.innerText.toLowerCase().includes(searchTerm)
        ? "block"
        : "none";
    });
  });

  // Floor buttons
  const btnContainer = document.createElement("div");
  Object.assign(btnContainer.style, {
    display: "flex",
    gap: "10px",
    padding: "0 40px 20px",
    flexWrap: "wrap",
  });

  floorTitles.forEach((title, i) => {
    const btn = document.createElement("button");
    btn.textContent = title.textContent;
    Object.assign(btn.style, {
      background: "#035a03",
      color: "white",
      border: "none",
      borderRadius: "10px",
      padding: "8px 15px",
      cursor: "pointer",
      transition: "0.3s",
    });

    btn.addEventListener("mouseover", () => (btn.style.background = "#027a2a"));
    btn.addEventListener("mouseout", () => (btn.style.background = "#035a03"));

    btn.addEventListener("click", () => {
      document.querySelectorAll(".dorm-layout").forEach((f) => (f.style.display = "none"));
      document.querySelectorAll(".floor-title").forEach((t) => (t.style.display = "none"));

      document.querySelectorAll(".dorm-layout")[i].style.display = "flex";
      floorTitles[i].style.display = "block";
    });

    btnContainer.appendChild(btn);
  });

  // Reset button
  const resetBtn = document.createElement("button");
  resetBtn.textContent = "Show All Floors";
  Object.assign(resetBtn.style, {
    background: "#024a1b",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "8px 15px",
    cursor: "pointer",
    transition: "0.3s",
  });
  resetBtn.addEventListener("mouseover", () => (resetBtn.style.background = "#027a2a"));
  resetBtn.addEventListener("mouseout", () => (resetBtn.style.background = "#024a1b"));
  resetBtn.addEventListener("click", () => {
    document.querySelectorAll(".dorm-layout").forEach((f) => (f.style.display = "flex"));
    document.querySelectorAll(".floor-title").forEach((t) => (t.style.display = "block"));
  });

  btnContainer.appendChild(resetBtn);
  mainPage.insertBefore(btnContainer, floorTitles[0]);

  // Room hover & click styles
  rooms.forEach((room) => {
    room.addEventListener("click", () => {
      rooms.forEach((r) => (r.style.outline = "none"));
      room.style.outline = "3px solid #027a2a";
      room.style.transition = "outline 0.2s ease";
    });

    room.addEventListener("mouseover", () => {
      room.style.transform = "scale(1.03)";
    });

    room.addEventListener("mouseout", () => {
      room.style.transform = "scale(1)";
    });
  });
});


// ==================== HISTORY PAGE ====================
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("historyTableBody");
  if (!tableBody) return;

  function getReports() {
    return JSON.parse(localStorage.getItem("reports")) || [];
  }

  function renderHistory() {
    const reports = getReports();
    tableBody.innerHTML = "";

    if (reports.length === 0) {
      tableBody.innerHTML = `
        <tr><td colspan="7" style="text-align:center; color:gray; padding:15px;">
          No reports found
        </td></tr>`;
      return;
    }

    reports.sort((a, b) => new Date(b.date) - new Date(a.date));

    reports.forEach((r, i) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${i + 1}</td>
        <td>${r.name}</td>
        <td>${r.id}</td>
        <td>${r.room}</td>
        <td>${r.issue}</td>
        <td>${r.date}</td>
        <td><button class="delete-btn" data-index="${i}">🗑️ Delete</button></td>
      `;
      tableBody.appendChild(row);
    });

    // Add delete functionality
    tableBody.querySelectorAll(".delete-btn").forEach((btn) =>
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this report?")) {
          const index = btn.getAttribute("data-index");
          const reports = getReports();
          reports.splice(index, 1);
          localStorage.setItem("reports", JSON.stringify(reports));
          renderHistory();
        }
      })
    );
  }

  renderHistory();
});


// ==================== DORM REPLACEMENT ====================
const floorData = {
  Floor1: { NumberOfStudent: 90, NumberOfDorm: 4, NumberOfDormReserved: 3, NumberOfDormAvailable: 2 },
  Floor2: { NumberOfStudent: 80, NumberOfDorm: 4, NumberOfDormReserved: 3, NumberOfDormAvailable: 1 },
  Floor3: { NumberOfStudent: 70, NumberOfDorm: 4, NumberOfDormReserved: 1, NumberOfDormAvailable: 3 },
};

let usedCount = 0;

function updateReport(floorId) {
  const choice = document.getElementById(floorId)?.value;
  const availableDiv = document.getElementById("available");
  if (!availableDiv || !choice) return;

  const floorNum = floorId.replace("Floor", "");
  const floorLabel = `${floorNum}${floorNum === "1" ? "st" : floorNum === "2" ? "nd" : "rd"}`;
  const data = floorData[floorId][choice];
  const readableName = choice.replace("NumberOf", "").replace(/([A-Z])/g, " $1").trim();

  availableDiv.innerHTML = `<strong>${floorLabel} Floor</strong> ${readableName}: <b>${data}</b>`;
  usedCount++;

  const totalRemaining = Object.values(floorData)
    .reduce((sum, obj) => sum + Object.values(obj).reduce((a, b) => a + b, 0), 0);

  document.getElementById("totals").textContent = `Total Used: ${usedCount} | Total Remaining: ${totalRemaining}`;

  // Save to history
  saveToHistory(`${floorLabel} Floor`, readableName, data);
}

function saveToHistory(floor, choice, value) {
  const record = {
    floor,
    choice,
    value,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  };
  const history = JSON.parse(localStorage.getItem("dormReplacementHistory")) || [];
  history.push(record);
  localStorage.setItem("dormReplacementHistory", JSON.stringify(history));
}

function resetAvailability() {
  ["Floor1", "Floor2", "Floor3"].forEach((id) => (document.getElementById(id).value = ""));
  document.getElementById("available").innerHTML = "";
  usedCount = 0;
  document.getElementById("totals").textContent = "Total Used: 0 | Total Remaining: 0";
}
