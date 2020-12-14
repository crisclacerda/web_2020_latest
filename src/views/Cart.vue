<template>
  <v-app>
    <span class="title">
      <h2>Carrinho</h2>
    </span>
    <v-cointainer>
      <v-row>
        <v-col sm="8" md="5" offset-md="2" lg="4" offset-lg="3">
          <v-card outlined>
            <v-card-title>Produtos</v-card-title>
            <v-row v-for="product in products" :key="product.name">
              <HorizontalProduct :product="product" @increment="incrementProduct(product)" @decrement="decrementProduct(product)" />
            </v-row>
          </v-card>
        </v-col>

        <v-col sm="4" md="3">
          <CheckoutBox :totalPrice="totalPrice" :totalProducts="totalProducts" />
        </v-col>
      </v-row>
    </v-cointainer>
  </v-app>
</template>

<script>
import axios from "axios";
import HorizontalProduct from "../components/cards/HorizontalProduct.vue";
import CheckoutBox from "../components/cart/CheckoutBox.vue";
import Carrinho from "../services/cart"

export default {
  components: {
    HorizontalProduct,
    CheckoutBox,
  },
  data: function () {
    return {
      products: [],
    };
  },
  methods: {
    incrementProduct (product) {
      product.quantity += 1
      Carrinho.updateQuantity(product.id, +1)
    },
    decrementProduct (product) {
      product.quantity -= 1
      Carrinho.updateQuantity(product.id, -1)
    } 
  },
  computed: {
    // Função para calcular preço total da compra
    totalPrice() {
      return this.products.reduce((sum, product) => {
        return sum + product.quantity * product.price;
      }, 0);
    },
    // Função para calcular quantidade total de produtos no carrinho
    totalProducts() {
      return this.products.reduce((sum, product) => {
        return sum + product.quantity;
      }, 0);
    },
  },
  // Importa dados da requisição para o front
  async beforeCreate() {
    this.products = await getItens();
  },
};

// Função que faz busca de itens que estão no carrinho
// Depois pega informações extras de cada produto cadastrado
// no banco de dados de estoque da loja.
async function getItens() {

  const carrinho = Carrinho.getCarrinho()
  let products = []
  console.log(carrinho)
  console.log(carrinho.keys())
  for (let productID of carrinho.keys()) { 
    console.log(productID)
    const produtctData = await axios.get(`http://localhost:3000/api/produtos/${ productID }`);
    const product = {}
    product.name = produtctData.data.name;
    product.price = produtctData.data.preco_produto;
    product.image_url = produtctData.data.foto;
    product.id = productID
    product.quantity = carrinho.get(productID)
    products.push(product)
  }
  return products;
}
</script>

<style scoped>
.title {
  text-align: center;
  padding: 0;
}
</style>