const elements = {
  amount: document.getElementById('amount'),
  quantity: document.getElementById('quantity'),
  invoice: document.getElementById('invoice'),
  expiry: document.getElementById('expiry'),
  generateBtn: document.getElementById('generate'),
  status: document.getElementById('status'),
  resultBox: document.getElementById('referenceBox'),
  referenceText: document.getElementById('referenceText'),
  referenceDetails: document.getElementById('referenceDetails'),
  loader: document.getElementById('loader'),
  referenceSection: document.getElementById('referenceSection'),
  paymentSection: document.getElementById('paymentSection'),
  paymentsList: document.getElementById('paymentsList'),
  showPaymentsBtn: document.getElementById('showPaymentsBtn'),
  backBtn: document.getElementById('backBtn')
};

elements.generateBtn.addEventListener('click', async () => {
  clearStatus();
  showLoader(true);
  
  try {
    const refIdRes = await fetch('https://proxypay-api.vercel.app/api/references', { method: "POST" });
    if (!refIdRes.ok) throw await refIdRes.text();
    const refData = await refIdRes.json();
    const referenceId = refData.id;
    
    const totalAmount = parseFloat(elements.amount.value) * parseInt(elements.quantity.value);
    
    const payload = {
      amount: Math.round(totalAmount * 1), // Convert to centavos for API
      end_datetime: elements.expiry.value,
      custom_fields: {
        invoice: elements.invoice.value
      }
    };
    
    const refRes = await fetch(`https://proxypay-api.vercel.app/api/references?reference_id=${referenceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if (refRes.status === 204) {
      showStatus('Referência criada com sucesso!', true);
      showReference(referenceId, {
        valor: totalAmount.toFixed(2) + ' AOA',
        quantidade: elements.quantity.value,
        fatura: elements.invoice.value,
        validade: elements.expiry.value
      });
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
  elements.referenceDetails.innerHTML = '';
}

function showStatus(message, success = true) {
  elements.status.innerText = message;
  elements.status.style.color = success ? 'green' : 'red';
}

function showReference(refId, details) {
  elements.resultBox.style.display = 'block';
  elements.referenceText.innerText = refId;
  elements.referenceText.onclick = () => {
    navigator.clipboard.writeText(refId);
    showStatus('Copiado para a área de transferência!', true);
  };
  elements.referenceDetails.innerHTML = `
    <p>Valor Total: <strong>${details.valor}</strong></p>
    <p>Quantidade: <strong>${details.quantidade}</strong></p>
    <p>Fatura: <strong>${details.fatura}</strong></p>
    <p>Validade: <strong>${new Date(details.validade).toLocaleString()}</strong></p>
  `;
  setTimeout(() => {
    elements.resultBox.scrollIntoView({ behavior: 'smooth' });
  }, 300);
}

function showLoader(visible) {
  elements.loader.style.display = visible ? 'block' : 'none';
}

// Payments logic
elements.showPaymentsBtn.addEventListener('click', async () => {
  elements.referenceSection.style.display = 'none';
  elements.paymentSection.style.display = 'block';
  elements.paymentsList.innerText = 'Carregando...';
  
  try {
    const response = await fetch('https://proxypay-api.vercel.app/api/payments');
    if (!response.ok) throw new Error('Erro ao buscar pagamentos.');
    const data = await response.json();
    elements.paymentsList.innerText = JSON.stringify(data, null, 2);
  } catch (err) {
    elements.paymentsList.innerText = 'Erro: ' + err.message;
  }
});

elements.backBtn.addEventListener('click', () => {
  elements.paymentSection.style.display = 'none';
  elements.referenceSection.style.display = 'block';
});