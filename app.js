const fromSelect = document.querySelector('select[name="from"]');
const toSelect = document.querySelector('select[name="to"]');
const fromFlag = document.getElementById('from-flag');
const toFlag = document.getElementById('to-flag');
const msgDiv = document.querySelector('.msg');
const convertBtn = document.getElementById('convert-btn');
const swapIcon = document.querySelector('.fa-arrow-right-arrow-left');
const amountInput = document.querySelector('.amount input');

// Populate the dropdowns
for (let currency in countryList) {
  const optionFrom = document.createElement('option');
  optionFrom.value = currency;
  optionFrom.textContent = currency;
  fromSelect.appendChild(optionFrom);

  const optionTo = document.createElement('option');
  optionTo.value = currency;
  optionTo.textContent = currency;
  toSelect.appendChild(optionTo);
}

// Update flags on dropdown change
fromSelect.addEventListener('change', () => {
  fromFlag.src = `https://flagsapi.com/${countryList[fromSelect.value]}/flat/64.png`;
});

toSelect.addEventListener('change', () => {
  toFlag.src = `https://flagsapi.com/${countryList[toSelect.value]}/flat/64.png`;
});

// Fetch and update exchange rate
const updateExchangeRate = async () => {
  const fromCurrency = fromSelect.value;
  const toCurrency = toSelect.value;
  const amount = amountInput.value;

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
    );
    const data = await response.json();
    const rate = data.rates[toCurrency];
    const convertedAmount = (amount * rate).toFixed(2);
    msgDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } catch (error) {
    console.error("Error fetching conversion rate:", error);
    msgDiv.textContent = "Error fetching conversion rate.";
  }
};

// Trigger conversion on button click
convertBtn.addEventListener('click', updateExchangeRate);

// Trigger conversion on Enter key press within the amount input field
amountInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Prevent the form from submitting
    updateExchangeRate();
  }
});

// Swap currencies and flags on swap icon click
swapIcon.addEventListener('click', () => {
  // Swap the selected currencies
  const tempCurrency = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = tempCurrency;

  // Update the flags accordingly
  fromFlag.src = `https://flagsapi.com/${countryList[fromSelect.value]}/flat/64.png`;
  toFlag.src = `https://flagsapi.com/${countryList[toSelect.value]}/flat/64.png`;

  // Optionally, trigger the conversion immediately after swapping
  updateExchangeRate();
});
