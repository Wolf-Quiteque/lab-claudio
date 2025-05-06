function labClaudioApp() {
  return {
    token: '',
    referenciaId: '',
    novaReferencia: {
      id: '',
      amount: '',
      end_datetime: '',
      invoice: ''
    },
    mensagemReferencia: '',
    pagamentos: [],
    
    gerarReferenciaId() {
      this.referenciaId = Math.floor(Math.random() * 1e9).toString();
      this.novaReferencia.id = this.referenciaId;
    },
    
    async criarReferencia() {
      if (!this.token) {
        alert("Insira o token primeiro.");
        return;
      }
      try {
        const res = await fetch('https://api.proxypay.co.ao/rps/v2/references', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${this.token}`
          },
          body: JSON.stringify(this.novaReferencia)
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        const data = await res.json();
        this.mensagemReferencia = `✅ Referência ${data.id} criada com sucesso!`;
      } catch (err) {
        this.mensagemReferencia = `Erro: ${err.message}`;
      }
    },
    
    async verPagamentos() {
      if (!this.token) {
        alert("Insira o token primeiro.");
        return;
      }
      try {
        const res = await fetch('https://api.proxypay.co.ao/rps/v2/payments', {
          headers: {
            'Authorization': `Token ${this.token}`
          }
        });
        
        if (!res.ok) throw new Error(await res.text());
        
        this.pagamentos = await res.json();
      } catch (err) {
        alert(`Erro ao buscar pagamentos: ${err.message}`);
      }
    }
  };
}