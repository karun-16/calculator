const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");
const toggle = document.getElementById("themeToggle");
const modeText = document.getElementById("modeText");
const historyBox = document.getElementById("history");
const historyBtn = document.getElementById("historyBtn");

const MAX_LENGTH = 16; // Windows Standard limit

let expression = "";
let history = [];

/* ================= THEME ================= */
toggle.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    modeText.textContent = toggle.checked ? "Switch to Light" : "Switch to Dark";
});

/* ================= HISTORY ================= */
historyBtn.addEventListener("click", () => {
    historyBox.classList.toggle("hidden");
});

/* ================= BUTTON INPUT ================= */
buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (value !== undefined) append(value);
        if (action) handleAction(action);
    });
});

/* ================= KEYBOARD INPUT ================= */
document.addEventListener("keydown", e => {
    if ("0123456789".includes(e.key)) {
        append(e.key);
    } else if ("+-*/.".includes(e.key)) {
        appendOperator(e.key);
    } else if (e.key === "Enter") {
        calculate();
    } else if (e.key === "Backspace") {
        backspace();
    } else if (e.key === "Escape") {
        clearAll();
    }
});

/* ================= INPUT LOGIC ================= */
function append(val) {
    if (expression.length >= MAX_LENGTH) return;

    // Prevent leading zero
    if (expression === "0") expression = "";

    expression += val;
    updateDisplay();
}

function appendOperator(op) {
    if (!expression) return; // no operator first

    const last = expression.slice(-1);
    if ("+-*/.".includes(last)) return; // no double operator

    expression += op;
    updateDisplay();
}

function handleAction(action) {
    switch (action) {
        case "clear":
            clearAll();
            break;

        case "equals":
            calculate();
            break;

        case "percent":
            if (!expression) return;
            try {
                expression = String(eval(expression) / 100);
                updateDisplay();
            } catch {}
            break;

        case "backspace":
            backspace();
            break;
    }
}

/* ================= CALCULATION ================= */
function calculate() {
    if (!expression) return;

    const last = expression.slice(-1);
    if ("+-*/.".includes(last)) return; // invalid end

    try {
        const result = eval(expression);
        history.unshift(`${expression} = ${result}`);
        if (history.length > 6) history.pop();
        renderHistory();
        expression = String(result);
    } catch {
        // do nothing (Windows style)
    }
    updateDisplay();
}

/* ================= UTIL ================= */
function backspace() {
    expression = expression.slice(0, -1);
    updateDisplay();
}

function clearAll() {
    expression = "";
    updateDisplay();
}

function updateDisplay() {
    display.textContent = expression || "0";
    adjustFontSize();
}

/* ================= FONT SCALING ================= */
function adjustFontSize() {
    const maxFont = 40;
    const minFont = 22;

    display.style.fontSize = maxFont + "px";

    while (
        display.scrollWidth > display.clientWidth &&
        parseFloat(display.style.fontSize) > minFont
    ) {
        display.style.fontSize =
            parseFloat(display.style.fontSize) - 1 + "px";
    }
}

/* ================= HISTORY ================= */
function renderHistory() {
    historyBox.innerHTML = history.map(h => `<div>${h}</div>`).join("");
}
