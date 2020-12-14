<template>
  <v-app>
    <div class="cart_wrapper">
      <v-card outlined>
        <v-card-title>Resumo do pedido</v-card-title>

        <v-card-text>
          <p>{{ totalProducts }} produto(s) no carrinho</p>
          <p>Total: R${{ totalPrice }}</p>
          <v-btn
            href="/finalizar"
            color="primary"
            @click="finalizarCompra"
            class="mx-auto large black--text"
          >
            Finalizar
          </v-btn>
        </v-card-text>
      </v-card>
    </div>
  </v-app>
</template>

<script>

export default {
  name: "Cart",
  props: ['totalPrice', 'totalProducts'],
};
</script>

<style scoped>
</style>