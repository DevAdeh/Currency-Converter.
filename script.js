const fromSelect = document.getElementById('fromCurrency');
const toSelect = document.getElementById('toCurrency');
const form = document.getElementById('converterForm');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const result = document.getElementById('result');
const swapBtn = document.getElementById('swapBtn');

// 1. Fetch the list of supported currencies and fill both dropdowns
async function loadCurrencies() {
  try {
    const res = await fetch('https://api.frankfurter.app/currencies');
    const data = await res.json(); // e.g. { USD: "US Dollar", NGN: "Nigerian Naira", ... }

    const options = Object.entries(data)
      .map(([code, name]) => `<option value="${code}">${code} - ${name}</option>`)
      .join('');

    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;

    // Sensible defaults
    fromSelect.value = 'USD';
    toSelect.value = 'NGN';
  } catch (err) {
    errorMessage.textContent = "Couldn't load currency list. Check your connection.";
    errorMessage.classList.remove('hidden');
  }
}
loadCurrencies();

// 2. Swap the two selected currencies
swapBtn.addEventListener('click', () => {
  const temp = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = temp;
});

// 3. Handle the conversion
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const amount = document.getElementById('amount').value;
  const from = fromSelect.value;
  const to = toSelect.value;

  result.classList.add('hidden');
  errorMessage.classList.add('hidden');
  loading.classList.remove('hidden');

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`);
    const data = await res.json();

    const convertedAmount = data.rates[to];
    const rate = (convertedAmount / amount).toFixed(4);

    result.innerHTML = `
      <p class="converted-amount">${convertedAmount.toLocaleString()} ${to}</p>
      <p class="rate-info">1 ${from} = ${rate} ${to}</p>
    `;
    result.classList.remove('hidden');

  } catch (err) {
    errorMessage.textContent = "Conversion failed. Please try again.";
    errorMessage.classList.remove('hidden');
  } finally {
    loading.classList.add('hidden');
  }
});