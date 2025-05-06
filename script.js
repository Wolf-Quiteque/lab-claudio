document.addEventListener('alpine:init', () => {
  Alpine.data('labClaudio', () => ({
    apiKey: '',
    referenceId: '',
    referenceAmount: '',
    referenceInvoice: '',
    referenceExpiry: '',
    createdReferenceId: '',
    payments: [],
    paymentAckId: '',
    result: '',
    error: '',
    
    async generateReferenceId() {
      this.clearStatus()
      try {
        const response = await fetch('https://api.proxypay.co.ao/reference_ids', {
          method: 'POST',
          headers: this.getHeaders()
        });
        
        if (!response.ok) throw await response.text();
        
        const id = await response.text(); // it's returned as plain text, not JSON
        this.referenceId = id;
        this.createdReferenceId = id;
        this.result = 'Referência gerada com sucesso!';
      } catch (err) {
        this.error = 'Erro ao gerar referência: ' + err;
      }
    },
    
    async createOrUpdateReference() {
      this.clearStatus()
      try {
        const payload = {
          amount: this.referenceAmount,
          end_datetime: this.referenceExpiry,
          custom_fields: {
            invoice: this.referenceInvoice
          }
        };
        
        const response = await fetch(`https://api.proxypay.co.ao/references/${this.referenceId}`, {
          method: 'PUT',
          headers: this.getHeaders(),
          body: JSON.stringify(payload)
        });
        
        if (response.status === 204) {
          this.result = 'Referência criada/atualizada com sucesso!';
        } else {
          const errorData = await response.json();
          throw JSON.stringify(errorData);
        }
      } catch (err) {
        this.error = 'Erro ao criar/atualizar referência: ' + err;
      }
    },
    
    async getPayments() {
      this.clearStatus()
      try {
        const response = await fetch('https://api.proxypay.co.ao/payments?n=100', {
          method: 'GET',
          headers: this.getHeaders()
        });
        
        if (!response.ok) throw await response.text();
        
        const payments = await response.json();
        this.payments = payments;
        this.result = `Carregados ${payments.length} pagamentos pendentes.`;
      } catch (err) {
        this.error = 'Erro ao obter pagamentos: ' + err;
      }
    },
    
    async acknowledgePayment(id) {
      this.clearStatus()
      try {
        const response = await fetch(`https://api.proxypay.co.ao/payments/${id}`, {
          method: 'DELETE',
          headers: this.getHeaders()
        });
        
        if (response.status === 204) {
          this.result = `Pagamento ${id} reconhecido com sucesso.`;
          this.getPayments();
        } else {
          const errorData = await response.json();
          throw JSON.stringify(errorData);
        }
      } catch (err) {
        this.error = 'Erro ao reconhecer pagamento: ' + err;
      }
    },
    
    getHeaders() {
      return {
        'Authorization': 'Token ' + this.apiKey,
        'Accept': 'application/vnd.proxypay.v2+json',
        'Content-Type': 'application/json'
      };
    },
    
    clearStatus() {
      this.result = '';
      this.error = '';
    }
  }));
});