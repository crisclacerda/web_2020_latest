<template>
  <v-app>
    <div class="hello">
      <form id="register">
        <div class="container">
          <section class="payment">
            <div class="title">
              <h2>Pagamento</h2>
            </div>

            <form-text
              v-model="card.number"
              label="Número do cartão"
              required="true"
              placeholder="Ex. 0123 4567 8901 2345"
              pattern="^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$"
              id="card-number"
            />
            <form-text
              v-model="card.name"
              label="Nome impresso no cartão"
              required="true"
              placeholder="Maria da Silva"
              id="card-number"
            />
            <form-text
              v-model="card.expiration"
              label="Validade"
              required="true"
              placeholder="10/10"
              pattern="[0-9]{2}/[0-9]{2}"
              id="card-number"
            />
            <form-text
              v-model="card.code"
              label="Cód. de Segurança"
              required="true"
              placeholder="123"
              pattern="[0-9]{3}"
              id="card-number"
            />

            <label>
              <input
                v-model="form.subscribe"
                type="checkbox"
                checked="checked"
                name="subscribe"
                style="margin-bottom: 15px"
              />
              Salvar o cartão para compras futuras
            </label>
          </section>

          <br />
          <br />

          <section class="delivery">
            <div class="title">
              <h2>Entrega</h2>
            </div>

            <form-text
              v-model="address.cep"
              label="CEP"
              required="true"
              placeholder="12345-678"
              pattern="[0-9]{5}-[0-9]{3}"
              id="cep"
            />
            <form-text
              v-model="address.neighborhood"
              label="Bairro"
              required="true"
              placeholder="Ex. Morumbi"
              id="neighborhood"
            />
            <form-text
              v-model="address.city"
              label="Cidade"
              required="true"
              placeholder="Ex. São Paulo"
              id="city"
            />
            <form-text
              v-model="address.state"
              label="Estado"
              required="true"
              placeholder="Ex. SP"
              pattern="[A-Za-z]{2}"
              id="state"
            />
          </section>

          <section>
            <p>Total: R${{ totalPrice }} por {{ totalProducts }} produtos </p>
          </section>
        </div>

        <div class="center mb-8">
          <v-btn class="black--text" color="primary" large
            @click="concludeOrder">Finalizar Compra</v-btn
          >
        </div>
      </form>
    </div>
  </v-app>
</template>

<script>
import TextInput from "./TextInput";
import axios from "axios";
import Carrinho from "../services/cart"

export default {
  name: "RegistrationForm",
  components: {
    "form-text": TextInput,
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
  async beforeCreate() {
      this.products = await getItens();
  },
  data: function () {
    return {
      products: [],
      card: {
        number: null,
        name: null,
        expiration: null,
        code: null,
      },
      address: {
        city: null,
        state: null,
        neighborhood: null,
        number: null,
      },
      form: {},
    };
  },
  methods: {
    async concludeOrder() {
        //let carrinho = JSON.stringify(Array.from(Carrinho.getCarrinho().entries()))
        const productsID = Carrinho.getCarrinho().keys()
        const request = {
          products: []
        }
        for (const productID of productsID) {
          console.log('productID')
          const product = {
            id: productID,
            quantity: Carrinho.getCarrinho().get(productID)
          }
          request.products.push(product)
        }
        Carrinho.deletar()
        await axios.post("http://localhost:3000/api/carrinho/", request)
        alert("Compra realizada com sucesso")
        window.location.href = "/";
    }
    
  }
};

async function getItens() {

  const carrinho = Carrinho.getCarrinho()
  let products = []
  for (let productID of carrinho.keys()) { 
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
form {
  width: 500px;
  margin: 0 auto;
}

.container {
  padding: 10%;
}

h2 {
  margin-bottom: 30px;
}

.center {
  display: flex;
  justify-content: center;
}
</style>
