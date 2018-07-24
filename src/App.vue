<template>
  <b-container class="bv-example-row">
    <b-row class="justify-content-center mt-5"> 
      <b-col sm="12" centered>
       <b-row>
        <b-col sm="6"> 
          <b-card header="Многоуровневый select с выбранным родительским элементом">
            <multi-level-select :records="countries" :selected="selectedOne" @getItem="getOne"/>
            <b-button variant="success"  class="float-right secondary" @click="actionOne">Действие</b-button>
          </b-card>
        </b-col>
        <b-col sm="6"> 
          <b-card header="Многоуровневый select с выбранным дочерним элементом">
            <multi-level-select :records="countries" :selected="selectedTwo" @getItem="getTwo"/>
            <b-button variant="success" class="float-right" @click="actionTwo">Действие</b-button>
          </b-card>
        </b-col>
        <b-col sm="6"> 
          <b-card header="Многоуровневый select">
            <multi-level-select :records="countries" :selected="selectedTree" @getItem="getTwo"/>
            <b-button variant="success" class="float-right" @click="actionTwo">Действие</b-button>
          </b-card>
        </b-col>
      </b-row>
    </b-col>
  </b-row>
</b-container>
</template>

<script>
export default {
  data () {
    return {
      countries: [
        {
          text: 'Казахстан',
          value: 100,
          children: [
            {
              text: 'Астана',
              value: 101,
              parentId: 100
            },
            {
              text: 'Алматы',
              value: 105,
              parentId: 100
            },
            {
              text: 'Караганда',
              value: 103,
              parentId: 100
            }
          ]
        },
        {
          text: 'Китай',
          value: 500,
          children: [
            {
              text: 'Гуанчжоу',
              value: 509,
              parentId: 500
            },
            {
              text: 'Шанхай',
              value: 510,
              parentId: 500
            },
            {
              text: 'Чэнду',
              value: 507,
              parentId: 500
            },
            {
              text: 'Сиань',
              value: 506,
              parentId: 500
            }
          ]
        },
        {
          text: 'Россия',
          value: 300,
          children: [
            {
              text: 'Новосибирск',
              value: 312,
              parentId: 300
            },
            {
              text: 'Питер',
              value: 326,
              parentId: 300
            }
          ]
        },
        {
          text: 'США',
          value: 900,
          children: []
        }
      ],
      cities: [],
      selectedOne: {},
      selectedTwo: {},
      selectedTree: {}
    };
  },
  methods: {
    getOne(item) {
      this.selectedOne = item;
    },
    getTwo(item) {
      this.selectedTwo = item;
    },
    getTree(item) {
      this.selectedTree = item;
    },
    actionOne() {
      console.log('selected item', this.selectedOne);
    },
    actionTwo() {
      console.log('selected item', this.selectedTwo);
    },
    actionThree() {
      console.log('selected item', this.selectedTree);
    }
  },
  created() {
    this.$set(this, 'selectedOne', this.countries[1].children[0]);
    this.$set(this, 'selectedTwo', this.countries[2]);
  }
}
</script>

<style scoped>

</style>
