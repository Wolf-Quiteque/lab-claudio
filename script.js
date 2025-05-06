const elements = {
  amount: document.getElementById('amount'),
  quantity: document.getElementById('quantity'),
  invoice: document.getElementById('invoice'),
  expiry: document.getElementById('expiry'),
  generateBtn: document.getElementById('generate'),
  status: document.getElementById('status'),
  resultBox: document.getElementById('referenceBox'),
  referenceText: document.getElementById('referenceText'),
  loader: document.getElementById('loader')
};

elements.generateBtn.addEventListener('click', async () => {
  clearStatus();
  showLoader(true);
  
  try {
    // 1. Generate Reference ID
    const refIdRes = await fetch('https://proxypay-api.vercel.app/api/references',{method: "POST"});
    
    if (!refIdRes.ok) throw await refIdRes.text();
    const refData = await refIdRes.json();
    const referenceId = refData.id;
    
    // 2. Build Reference payload
    const payload = {
      amount: parseInt(elements.amount.value) * parseInt(elements.quantity.value),
      end_datetime: elements.expiry.value,
      custom_fields: {
        invoice: elements.invoice.value
      }
    };
    
    // 3. Send Reference
    const refRes = await fetch(`https://proxypay-api.vercel.app/api/references?reference_id=${referenceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (refRes.status === 204) {
      showStatus('Referência criada com sucesso!', true);
      showReference(referenceId);
    } else {
      const errData = await refRes.json();
      throw JSON.stringify(errData);
    }
  } catch (err) {
    showStatus('Erro: ' + err, false);
  } finally {
    showLoader(false);
  }
});

function clearStatus() {
  elements.status.innerText = '';
  elements.resultBox.style.display = 'none';
  elements.referenceText.innerText = '';
}

function showStatus(message, success = true) {
  elements.status.innerText = message;
  elements.status.style.color = success ? 'green' : 'red';
}

function showReference(refId) {
  elements.resultBox.style.display = 'block';
  elements.referenceText.innerText = refId;
  elements.referenceText.onclick = () => {
    navigator.clipboard.writeText(refId);
    showStatus('Copiado para a área de transferência!', true);
  };
}

function showLoader(visible) {
  elements.loader.style.display = visible ? 'inline-block' : 'none';
}