
function labClaudioApp() {
  return {
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
      // Mock: gerar número aleatório
      this.referenciaId = Math.floor(Math.random() * 1e9);
    },
    criarReferencia() {
      if (!this.novaReferencia.id || !this.novaReferencia.amount) {
        this.mensagemReferencia = "Preencha todos os campos!";
        return;
      }
      this.mensagemReferencia = `✅ Referência ${this.novaReferencia.id} criada com sucesso!`;
    },
    verPagamentos() {
      this.pagamentos = [
        {
          id: 1,
          reference_id: 123456789,
          amount: "500.00",
          datetime: "2025-05-06T10:00:00"
        },
        {
          id: 2,
          reference_id: 987654321,
          amount: "750.50",
          datetime: "2025-05-05T15:30:00"
        }
      ];
    }
  };
}
