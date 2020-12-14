<template>
  <v-app>
    <div class="d-flex ml-15 mr-15">
      <v-row>
        <div class="ma-10">
          <v-card>
            <v-img
            :src="product.foto"
            contain
            max-width="400"
            alt="../assets/logo.png"
            ></v-img>
          </v-card>
        </div>
        <div>
          <v-container>
            <v-card max-width="700" class="mt-7">
              <h1>{{ product.name }}</h1>
              <v-card-text>
                <p class="display-1 text--primary align-center">
                  Preço: R$ {{ computePrice }}
                </p>
                <br/>
                <v-tabs>
                  <v-tab v-bind:style="styles" class="black--text font-weight-bold">Descrição</v-tab>
                  <v-tab-item>
                    <p class="font-weight-bold" v-bind:style="styles">{{ product.descricao_produto }}</p>
                  </v-tab-item>
                </v-tabs>
                <br/>
                <v-tabs>
                  <br/>
                  <v-tab v-bind:style="styles" class="black--text font-weight-bold">Informações visuais</v-tab>
                  <v-tab-item>
                  <p class="font-weight-bold" v-bind:style="styles">{{ product.descricao_foto }}</p>
                  </v-tab-item>
                </v-tabs>
                <div v-if="product.tam_produto.length !== 0">
                  <v-card-title color="black" class="black--text font-weight-bold" v-bind:style="styles"> Tamanhos </v-card-title>
                  <v-radio-group v-model="row" class="ml-2 black--text font-weight-bold" row v-bind:style="styles">
                    <v-radio class="vueradio" label="P" value="P"></v-radio>
                    <v-radio class="vueradio" label="M" value="M"></v-radio>
                    <v-radio class="vueradio" label="G" value="G"></v-radio>
                    <v-radio class="vueradio" label="GG" value="GG"></v-radio>
                  </v-radio-group>
                </div>
                <v-card-title  color="black" class="black--text font-weight-bold" v-bind:style="styles">
                  Quantidade 
                </v-card-title>
                <v-text-field
                  v-model="quantity"
                  type="number"
                  outlined
                  style="width: 100px"
                  :value="1"
                  min="1"
                  dense
                  v-bind:style="styles"
                ></v-text-field>
                <!-- BOTAO ADICIONAR CARRINHO -->
                <div class="center">
                  <v-btn
                    href="/carrinho"
                    @click="adicionarCarrinho"
                    color="primary"
                    class="mu-2 mb-8 black--text"
                    large
                  >
                    <v-icon>mdi-cart</v-icon> Adicionar o Carrinho
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-row>
    </div>
    <produtos tipo="PROMOÇÕES" :produtos="promocoes"></produtos>
  </v-app>
</template>

<script>
import produtos from "../components/ProductsShow.vue";
import carrinho from "../services/cart"

export default {
  name: "Home",
  data: () => {
    return {
      quantity: 1,
      preco: 0.0,
      product: [],
      promocoes: [],
      storeFont: 1.4,
      reveal: false,
      styles: {
        fontSize: '1.4em'
      },
      numericFontSize: 1.4,
    };
  },
  components: {
    produtos,
  },
  computed: {
    computePrice() {
      return (this.quantity * this.preco).toFixed(2) + '';
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    initialize() {
      //console.info("PAGINA DOS PRODUTOS " + this.$store.state.selectedProduct.name);
      this.product = this.$store.state.selectedProduct;
      this.preco = this.product.preco_produto; //parseFloat(this.product.preco_produto.replace(",", "."));
      this.promocoes = this.$store.state.promocoes;
      //console.info("INITIALIZE PRODUCT VIEW: " + this.promocoes[0].name);
    },
    aumentarFonte() {
      this.numericFontSize += 0.1
      if (this.numericFontSize >= 1.8) {
        this.numericFontSize = 1.8;
      }
      this.styles.fontSize = this.numericFontSize + 'em';
    },
    diminuirFonte() {
      this.numericFontSize -= 0.1
      if (this.numericFontSize <= 1.0) {
        this.numericFontSize = 1.0;
      }
      this.styles.fontSize = this.numericFontSize + 'em';
    },
    async adicionarCarrinho() {
      carrinho.adicionarProduto(this.product._id, this.quantity)
    },
  },
  watch: {
    '$store.state.fontSize': function() {
      //console.log(this.$store.state.fontSize)
      if (this.$store.state.fontSize > this.storeFont) {
        this.aumentarFonte()
      }
      else { 
        this.diminuirFonte()
      }

      this.storeFont = this.$store.state.fontSize;
    },
    '$store.state.selectedProduct': function() {
      this.product = this.$store.state.selectedProduct;
      this.preco = this.product.preco_produto; //parseFloat(this.product.preco_produto.replace(",", "."));
    },
    '$store.state.promocoes': function() {
      this.promocoes = this.$store.state.promocoes;
    }
  }
};
</script>

<style lang="scss" scoped>

h1 {
  text-align: center;
  padding: 16px;
  margin: 16px 0 0;
  font-family: Galada, arial;
  font-size: 3rem;
}

.center {
  display: flex;
  justify-content: center;
}

.v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}

.vueradio label {
  font-size: 1.0em;
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
  padding-right: 20px;
}

</style>
