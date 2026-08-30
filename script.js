// Lineboard — Call Tracking
// Handles call log state, rendering, filtering, and the log-a-call form.

const seedCalls = [
  { name: "Priya Shah", status: "connected", duration: 12, note: "Renewal discussion", time: "09:14 AM" },
  { name: "Marcus Lee", status: "missed", duration: 0, note: "No answer", time: "09:41 AM" },
  { name: "Dana Whitfield", status: "voicemail", duration: 0, note: "Left pricing follow-up", time: "10:02 AM" },
  { name: "Omar Haddad", status: "connected", duration: 23, note: "Onboarding call", time: "10:35 AM" },
  { name: "Yui Tanaka", status: "connected", duration: 6, note: "Quick check-in", time: "11:10 AM" },
];

let calls = [...seedCalls];
let activeFilter = "all";

const logList = document.getElementById("log-list");
const logCount = document.getElementById("log-count");
const form = document.getElementById("call-form");
const filters = document.getElementById("filters");

function statusLabel(s) {
  return { connected: "Connected", missed: "Missed", voicemail: "Voicemail" }[s];
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const filtered = activeFilter === "all" ? calls : calls.filter(c => c.status === activeFilter);

  logList.innerHTML = "";
  if (filtered.length === 0) {
    logList.innerHTML = `<li class="empty">No calls here yet — log one on the right.</li>`;
  } else {
    filtered.slice().reverse().forEach(c => {
      const li = document.createElement("li");
      li.className = "log-row";
      li.innerHTML = `
        <span class="status-dot ${c.status}"></span>
        <span class="log-main">
          <span class="name">${escapeHtml(c.name)}</span>
          <span class="meta">${c.time}${c.note ? " · " + escapeHtml(c.note) : ""}</span>
        </span>
        <span class="tag ${c.status}">${statusLabel(c.status)}</span>
        <span class="log-duration">${c.duration > 0 ? c.duration + "m" : "—"}</span>
      `;
      logList.appendChild(li);
    });
  }
  logCount.textContent = `${calls.length} call${calls.length === 1 ? "" : "s"}`;

  const connected = calls.filter(c => c.status === "connected").length;
  const missed = calls.filter(c => c.status === "missed").length;
  const voicemail = calls.filter(c => c.status === "voicemail").length;
  const totalMinutes = calls.reduce((sum, c) => sum + (c.duration || 0), 0);

  document.getElementById("stat-connected").textContent = connected;
  document.getElementById("stat-missed").textContent = missed;
  document.getElementById("stat-voicemail").textContent = voicemail;
  document.getElementById("stat-duration").textContent =
    totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : `${totalMinutes}m`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("f-name").value.trim();
  const status = document.getElementById("f-status").value;
  const duration = parseInt(document.getElementById("f-duration").value, 10) || 0;
  const note = document.getElementById("f-note").value.trim();
  if (!name) return;

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  calls.push({ name, status, duration, note, time });
  form.reset();
  render();
});

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  filters.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  render();
});

document.getElementById("today-date").textContent = new Date().toLocaleDateString(undefined, {
  weekday: "short", month: "short", day: "numeric"
});

render();
