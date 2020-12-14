<template>
  <v-app>
    <!-- Must have the app property -->
    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="#f7f7f7">
      <!-- Cabeçalho -->
      <v-toolbar-title style="width: 350px">
        <a href="/">
          <v-img
            href="/"
            class="mr-3"
            src="@/assets/logo.png"
            height="100%"
            width="50%"
          ></v-img>
        </a>
      </v-toolbar-title>

      <v-btn
        v-if="!logado"
        id="btn3"
        href="/entrar"
        class="my-3 black--text"
        color="primary"
      >
      <span>Entrar</span>
      <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-text-field
        flat
        filled
        background-color="grey lighten-1"
        hide-details
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar"
        class="hidden-sm-and-down pl-10 ml-4"
        v-model="busca"
        @keydown.enter="buscarProdutos"
      />
      <v-spacer />
      <v-btn color="primary" class="black--text" @click="aumentarFontes">
        +A
      </v-btn>
      <v-btn color="primary" class="black--text" @click="diminuirFontes">
        -A
      </v-btn>
      <v-btn
        id="btn1"
        href="/carrinho"
        class="my-3 black--text"
        color="primary"
      >
        <span>Carrinho</span>
        <v-badge v-if="$route.name !== 'Usuarios' && $route.name !== 'Estoque'" :content="totalProducts" :value="totalProducts" color="#4dd0e1">
          <!--v-badge :content="nitens" :value="nitens" content="numberItensCart()" value="1" color="#4dd0e1"-->
          <v-icon>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
      <v-btn
        v-if="!logado"
        id="btn2"
        href="/registrar"
        class="my-3 black--text"
        color="primary"
      >
      <span>Registrar</span>
      <v-icon>mdi-account-circle</v-icon>
      </v-btn>

      <v-btn
        v-if="administador"
        id="btn22"
        href="/usuarios"
        class="my-3 black--text"
        color="primary"
      >
      <span>Usuarios</span>
      </v-btn>

      <v-btn
        v-if="administador"
        id="btn33"
        href="/estoque"
        class="my-3 black--text"
        color="primary"
      >
      <span>Estoque</span>
      </v-btn>

      <v-btn
        v-if="logado"
        id="btn4"
        class="my-3 black--text"
        color="primary"
        @click="sair"
      >
      <span>Sair</span>
      <v-icon>mdi-account-circle</v-icon>
      </v-btn>


    </v-app-bar>
    <v-content>
      <v-bottom-navigation fixed :value="activeBtn" horizontal class="primary" large>
        <a
          v-for="(categoria, index) in categorias"
          :key="index"
          class="v-btn"
          v-bind:style="navigationStyles"
          @click="buscarCategorias(index)"
        >
          <span>{{ categoria.title }}</span>
        </a>
      </v-bottom-navigation>
    </v-content>

    <v-main>
      <router-view />
    </v-main>
    <!-- Rodapé -->
    <v-footer :padless="true">
      <v-card
        flat
        tile
        width="100%"
        class="white--text text-center"
        color="#233040"
      >
        <!-- Midias sociais  -->
        <v-card-text>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-facebook</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-instagram</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-twitter</v-icon>
          </v-btn>
          <v-btn class="mx-4 white--text" icon>
            <v-icon size="24px">mdi-email</v-icon>
          </v-btn>
        </v-card-text>

        <v-card-text class="white--text pt-0">
          <br />A BEUNI NÃO É REPRESENTANTE OFICIAL DESTA UNIVERSIDADE.
          <p>BEUNI TECNOLOGIA LTDA CNPJ: 12.345.678/0001-00</p>
          <p>© 2020 BEUNI - Todos os direitos reservados.</p>
        </v-card-text>
        <v-divider></v-divider>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import axios from 'axios';
import AuthService from './services/auth'
import Carrinho from './services/cart'


export default {
  name: "App",
  computed: {
    logado() {
      return AuthService.estaLogado()
    },
    administador() {
      return AuthService.isAdmin()
    },
    totalProducts() {
      const carrinho = Carrinho.getCarrinho()
      let totalQuantity = 0
      for (const quantity of carrinho.values()) {
        totalQuantity += quantity
      }
      return totalQuantity
    },
  },
  data() {
    return {
      productsInCart: [],
      busca: "",
      navigationStyles: {
        fontSize: "1.0em",
      },
      numericFontSize: 1.0,
      categorias: [
        { title: "Moletons" },
        { title: "Camisetas" },
        { title: "Shorts" },
      ],
      activeBtn: 1,
      nitens: null,
    };
  },
  created() {
    this.initialize()
  },
  methods: {
    async initialize() {
      this.$store.dispatch('salvaProdutos', await this.getProdutos());
      this.$store.dispatch('salvaNovidades', await this.findNovidades());
      this.$store.dispatch('salvaPromocoes', await this.findPromocoes());
      this.$store.dispatch('salvaExclusivos', await this.findExclusivos());
    },
    
    async getProdutos(){
      //método get: pega todos os produtos do Mongo:
      const response = await axios.get("http://localhost:3000/api/produtos");

      return response.data;
    },
    sair() {
      AuthService.logout()
      window.location.href = "/";
    },
    async findNovidades() {
      //método get: pega todos os produtos com a categoria Novidades do Mongo(3 produtos):
      const response = await axios.get("http://localhost:3000/api/produtos/findNovidades");

      return response.data;
    },
    
    async findPromocoes() {
      //método get: pega todos os produtos do Mongo:
      const response = await axios.get("http://localhost:3000/api/produtos/findPromocoes");

      return response.data;
    },

    async findExclusivos() {
      //método get: pega todos os produtos do Mongo:
      const response = await axios.get("http://localhost:3000/api/produtos/findExclusivos");

      return response.data;
    },

    stringValida(string) {
      return (string !== null && string.length !== 0 && string.trim());
    },

    buscarProdutos() {
      if (this.stringValida(this.busca)) {
        console.info("BUSCA: " + this.busca.trim());
        console.info("ROUTER ATUAL:" + this.$route.path.toString());

        if (this.$route.path !== '/produtos') {
          this.$router.push('/produtos');
          
          // Após ir para a próxima página, retrocedemos a nova página para o topo
          document.body.scrollTop = 0; //  Para o navegador Safari
          document.documentElement.scrollTop = 0; // Para o navegador Chrome, Firefox, IE e Opera
        }
        else {
          this.$router.go(0);
        }

        this.$store.dispatch('registraBusca', this.busca.trim());
      }
      else {
        console.info("VAZIA");
      }
    },

    buscarCategorias(indice) {
      if (indice === 0) {
        this.busca = "moletom";
      }
      else if (indice === 1) {
        this.busca = "camiseta";
      }
      else if (indice === 2) {
        this.busca = "shorts";
      }

      this.buscarProdutos();
    },

    aumentarFontes() {
      console.info("AUMENTAR");

      this.numericFontSize += 0.1;
      if (this.numericFontSize >= 1.8) {
        this.numericFontSize = 1.8;
      }
      this.navigationStyles.fontSize = this.numericFontSize + "em";

      this.$store.dispatch("enlargeFont");
    },
    diminuirFontes() {
      console.info("DIMINUIR");

      this.numericFontSize -= 0.1;
      if (this.numericFontSize <= 0.8) {
        this.numericFontSize = 0.8;
      }

      this.navigationStyles.fontSize = this.numericFontSize + "em";

      this.$store.dispatch("reduceFont");
    },
  },
};
</script>


<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  background-color: #4dd0e1; /* Deixa cinza pra manter o contraste até acharmos uma cor melhor.. */
}

.v-btn {
  margin-right: 10px;
}

html,
body,
.v-application,
.v-application--wrap {
  min-height: -webkit-fill-available;
}

.v-main,
.v-content {
  padding: 0;
}

.v-bottom-navigation {
  top:60px;
}

.categorias {
  font-size: 1rem;
  color: black;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
