let retroPowerSound, retroBeepSound;
try {
  retroPowerSound = new Audio("sounds/poweron.wav");
  retroBeepSound = new Audio("sounds/beep.wav");
} catch (e) {
  retroPowerSound = { play() {}, currentTime: 0 };
  retroBeepSound = { play() {}, currentTime: 0 };
}

function playRetroBeep() {
  retroBeepSound.currentTime = 0;
  retroBeepSound.play();
}

function animateNumber(element, start, end, duration) {
  if (!element) return;
  let startTime = null;

  function update(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = value;

    if (progress < 1 && Math.random() < 0.05 && document.body.classList.contains("retro")) {
      playRetroBeep();
    }

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function calculateChange() {
  const due = parseFloat(document.getElementById("amount-due").value);
  const paid = parseFloat(document.getElementById("amount-received").value);
  const results = document.getElementById("results");

  if (isNaN(due) || isNaN(paid)) {
    results.innerHTML = "<p>Please enter valid numbers.</p>";
    return;
  }

  let change = paid - due;

  document.getElementById("screenAmount").innerHTML = `
    Due: $${due.toFixed(2)}<br>
    Paid: $${paid.toFixed(2)}<br>
    Change: $${change.toFixed(2)}
  `;

  if (change < 0) {
    results.innerHTML = "<p>Customer still owes money.</p>";
    return;
  }

  let cents = Math.round(change * 100);

  let bill20 = Math.floor(cents / 2000); cents %= 2000;
  let bill10 = Math.floor(cents / 1000); cents %= 1000;
  let bill5  = Math.floor(cents / 500);  cents %= 500;
  let bill2  = Math.floor(cents / 200);  cents %= 200;
  let bill1  = Math.floor(cents / 100);  cents %= 100;

  let quarters = Math.floor(cents / 25); cents %= 25;
  let dimes    = Math.floor(cents / 10); cents %= 10;
  let nickels  = Math.floor(cents / 5);  cents %= 5;
  let pennies  = cents;

  let testDollars = Math.floor(change);
  document.getElementById("dollars-output").textContent = testDollars;
  document.getElementById("quarters-output").textContent = quarters;
  document.getElementById("dimes-output").textContent = dimes;
  document.getElementById("nickels-output").textContent = nickels;
  document.getElementById("pennies-output").textContent = pennies;

  results.innerHTML = `
    <div class="box slide-in">
      <h2 class="subtitle has-text-centered">Total Change: <strong>$${change.toFixed(2)}</strong></h2>

      <ul class="result-list">

        <li class="slide-in-item">
          <img src="images/bill20.png" class="bill-img" alt="$20 bill">
          $20 Bills: <span id="anim-b20">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/bill10.png" class="bill-img" alt="$10 bill">
          $10 Bills: <span id="anim-b10">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/bill5.png" class="bill-img" alt="$5 bill">
          $5 Bills: <span id="anim-b5">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/bill2.png" class="bill-img" alt="$2 bill">
          $2 Bills: <span id="anim-b2">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/bill1.png" class="bill-img" alt="$1 bill">
          $1 Bills: <span id="anim-b1">0</span>
        </li>

        <li class="slide-in-item">
          <img src="images/quarter.png" class="coin-img" alt="quarter">
          Quarters: <span id="anim-quarters">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/dime.png" class="coin-img" alt="dime">
          Dimes: <span id="anim-dimes">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/nickel.png" class="coin-img" alt="nickel">
          Nickels: <span id="anim-nickels">0</span>
        </li>
        <li class="slide-in-item">
          <img src="images/penny.png" class="coin-img" alt="penny">
          Pennies: <span id="anim-pennies">0</span>
        </li>

      </ul>
    </div>
  `;

  animateNumber(document.getElementById("anim-b20"), 0, bill20, 800);
  animateNumber(document.getElementById("anim-b10"), 0, bill10, 800);
  animateNumber(document.getElementById("anim-b5"), 0, bill5, 800);
  animateNumber(document.getElementById("anim-b2"), 0, bill2, 800);
  animateNumber(document.getElementById("anim-b1"), 0, bill1, 800);

  animateNumber(document.getElementById("anim-quarters"), 0, quarters, 800);
  animateNumber(document.getElementById("anim-dimes"), 0, dimes, 800);
  animateNumber(document.getElementById("anim-nickels"), 0, nickels, 800);
  animateNumber(document.getElementById("anim-pennies"), 0, pennies, 800);
}

function clearCalculator() {
  document.getElementById("amount-due").value = "";
  document.getElementById("amount-received").value = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("screenAmount").innerHTML = `
    Due: $0.00<br>
    Paid: $0.00<br>
    Change: $0.00
  `;
}

function setTheme(themeName) {
  if (themeName === "original") {
    document.body.className = "original";
  } else {
    document.body.className = themeName;
  }

  if (themeName === "retro") {
    retroPowerSound.currentTime = 0;
    retroPowerSound.play();
  }
}

document.getElementById("calculate-change")
  .addEventListener("click", calculateChange);
