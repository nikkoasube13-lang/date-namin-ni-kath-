/* ---------- Settings ---------- */
const NO_LINES = [
  "Really?",
  "Are you sure?",
  "Think about it...",
  "Pretty please?",
  "My treat!",
  "Last chance, I promise",
  "You can't catch me. Just press Yes.",
];

const MIN_NO_SCALE = 0.12;

/* ---------- Elements ---------- */
const steps = {
  ask: document.getElementById("step-ask"),
  plan: document.getElementById("step-plan"),
  day: document.getElementById("step-day"),
  message: document.getElementById("step-message"),
  done: document.getElementById("step-done"),
};

const yesBtn = document.getElementById("yes");
const noBtn = document.getElementById("no");
const askText = document.getElementById("ask-text");
const askEmoji = document.getElementById("ask-emoji");
const messageEl = document.getElementById("message");
const countEl = document.getElementById("count");
const copiedEl = document.getElementById("copied");

const calTitle = document.getElementById("cal-title");
const calDays = document.getElementById("cal-days");
const prevMonth = document.getElementById("prev-month");
const nextMonth = document.getElementById("next-month");

/* ---------- State ---------- */
let noCount = 0;
let chosenPlan = null;
let chosenEmoji = "";
let chosenDate = null;
let chosenDateText = "";
let replyText = "";

const today = new Date();
today.setHours(0, 0, 0, 0);
let viewYear = today.getFullYear();
let viewMonth = today.getMonth();

function show(name) {
  Object.entries(steps).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== name);
  });
}

/* ---------- Step 1: Yes / No ---------- */
noBtn.addEventListener("click", () => {
  noCount++;

  // No gets smaller and jumps to a new spot
  const scale = Math.max(MIN_NO_SCALE, 1 - noCount * 0.16);
  const x = (Math.random() - 0.5) * 240;
  const y = (Math.random() - 0.5) * 160;
  noBtn.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

  // Yes gets bigger
  const yesSize = Math.min(1.1 + noCount * 0.55, 7);
  yesBtn.style.fontSize = `${yesSize}rem`;

  askText.textContent = NO_LINES[Math.min(noCount - 1, NO_LINES.length - 1)];
  if (noCount >= NO_LINES.length) askEmoji.textContent = "🥺";
});

yesBtn.addEventListener("click", () => show("plan"));

/* ---------- Step 2: Walk or Coffee ---------- */
document.querySelectorAll(".choice").forEach((btn) => {
  btn.addEventListener("click", () => {
    chosenPlan = btn.dataset.plan;
    chosenEmoji = btn.dataset.emoji;
    document.getElementById("day-emoji").textContent = chosenEmoji;
    document.getElementById("day-title").textContent =
      `${chosenPlan} it is! Which date works for you?`;
    renderCalendar();
    show("day");
  });
});

/* ---------- Step 3: You pick the date (calendar) ---------- */
function renderCalendar() {
  const first = new Date(viewYear, viewMonth, 1);
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  calTitle.textContent = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  // Can't go back before the current month
  prevMonth.disabled = viewYear === today.getFullYear() && viewMonth === today.getMonth();

  calDays.innerHTML = "";

  // Empty cells before the 1st
  for (let i = 0; i < first.getDay(); i++) {
    const empty = document.createElement("span");
    empty.className = "day-empty";
    calDays.appendChild(empty);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(viewYear, viewMonth, d);
    const b = document.createElement("button");
    b.className = "day";
    b.textContent = d;
    b.setAttribute(
      "aria-label",
      date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    );

    if (date < today) b.disabled = true;
    if (date.getTime() === today.getTime()) b.classList.add("today");

    b.addEventListener("click", () => {
      chosenDate = date;
      chosenDateText = date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      document.getElementById("message-sub").textContent =
        `${chosenPlan} on ${chosenDateText}. Add a note if you want.`;
      show("message");
      messageEl.focus();
    });

    calDays.appendChild(b);
  }
}

prevMonth.addEventListener("click", () => {
  viewMonth--;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  renderCalendar();
});

nextMonth.addEventListener("click", () => {
  viewMonth++;
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
});

document.getElementById("back").addEventListener("click", () => show("plan"));

/* ---------- Step 4: Message ---------- */
messageEl.addEventListener("input", () => {
  countEl.textContent = messageEl.value.length;
});

document.getElementById("back-day").addEventListener("click", () => show("day"));

document.getElementById("send").addEventListener("click", () => {
  const note = messageEl.value.trim();

  replyText = `Yes, let's go on a date! ${chosenPlan} on ${chosenDateText}.`;
  if (note) replyText += `\n\nMy message: ${note}`;

  document.getElementById("summary").innerHTML =
    `${chosenPlan} ${chosenEmoji} on <strong>${chosenDateText}</strong>.`;

  const quote = document.getElementById("final-message");
  quote.textContent = note;
  quote.classList.toggle("hidden", !note);

  copiedEl.textContent = "";
  show("done");
});

/* ---------- Step 5: Done ---------- */
document.getElementById("copy").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(replyText);
    copiedEl.textContent = "Copied! Now paste it in a message to me.";
  } catch {
    copiedEl.textContent = "Couldn't copy automatically. Please select and copy the text above.";
  }
});

document.getElementById("reset").addEventListener("click", () => {
  noCount = 0;
  chosenPlan = null;
  chosenDate = null;
  chosenDateText = "";
  replyText = "";
  viewYear = today.getFullYear();
  viewMonth = today.getMonth();
  messageEl.value = "";
  countEl.textContent = "0";
  noBtn.style.transform = "";
  yesBtn.style.fontSize = "";
  askText.textContent = "No pressure. But Yes is right there.";
  askEmoji.textContent = "💌";
  show("ask");
});
