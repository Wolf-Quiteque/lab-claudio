const elements = {
  apiKey: document.getElementById('apiKey'),
  amount: document.getElementById('amount'),
  quantity: document.getElementById('quantity'),
  invoice: document.getElementById('invoice'),
  expiry: document.getElementById('expiry'),
  generateBtn: document.getElementById('generate'),
  status: document.getElementById('status'),
  resultBox: document.getElementById('referenceBox'),
  referenceText: document.getElementById('referenceText'),
  loader: document.getElementById('loader'),
};

elements.generateBtn.addEventListener('click', async () => {
  clearStatus();
  toggleLoader(true);
  
  const apiKey = elements.apiKey.value.trim();
  if (!apiKey) {
    showStatus('Por favor, insira sua chave da API.', false);
    toggleLoader(false);
    return;
  }
  
  try {
    // 1. Gerar ID de Referência
    const refIdRes = await fetch('https://api.proxypay.co.ao/reference_ids', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Accept': 'application/vnd.proxypay.v2+json'
      }
    });
    
    if (!refIdRes.ok) throw await refIdRes.text();
    const referenceId = await refIdRes.text();
    
    // 2. Construir payload da Referência
    const amount = parseInt(elements.amount.value);
    const quantity = parseInt(elements.quantity.value);
    const totalAmount = amount * quantity;
    
    const payload = {
      amount: totalAmount,
      end_datetime: elements.expiry.value,
      custom_fields: {
        invoice: elements.invoice.value
      }
    };
    
    // 3. Enviar Referência
    const refRes = await fetch(`https://api.proxypay.co.ao/references/${referenceId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Accept': 'application/vnd.proxypay.v2+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    if (refRes.status === 204) {
      showStatus('✅ Referência criada com sucesso. Clique abaixo para copiar.', true);
      showReference(referenceId);
    } else {
      const errData = await refRes.json();
      throw JSON.stringify(errData);
    }
  } catch (err) {
    showStatus('❌ Erro: ' + err, false);
  } finally {
    toggleLoader(false);
  }
});

function clearStatus() {
  elements.status.innerText = '';
  elements.resultBox.style.display = 'none';
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
    showStatus('📋 Copiado para a área de transferência!', true);
  };
}

function toggleLoader(show) {
  elements.loader.style.display = show ? 'block' : 'none';
}