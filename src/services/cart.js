class CarrinhoService {
    getCarrinho() {
        let carrinho = localStorage.getItem('carrinho')
        if (carrinho) {
             return new Map(JSON.parse(carrinho))
        }
        carrinho = new Map()
        return carrinho
    }
  
    deletar() {
      localStorage.removeItem('carrinho');
    }
  
    updateQuantity(productId, NewQuantityValue) {
        console.log('nova quantidade')
        const carrinho = this.getCarrinho()
        let quantity = carrinho.get(productId)
        quantity += NewQuantityValue
        if (quantity < 1) {
            return
        }
        carrinho.set(productId, quantity)
        this.salvarCarrinho(carrinho)
    }

    salvarCarrinho(carrinho) {
        localStorage.setItem('carrinho', JSON.stringify(Array.from(carrinho.entries())));
    }

    adicionarProduto (productId, quantity) {
        const carrinho = this.getCarrinho()
        if (carrinho.get(productId)) {
            quantity += carrinho.get(productId)
        }
        carrinho.set(productId, quantity)
        this.salvarCarrinho(carrinho)
    }
    debugCarrinho() {
        console.log(this.getCarrinho())
    }
  }
  
  
  
  export default new CarrinhoService();