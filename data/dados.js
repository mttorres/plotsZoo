//classe carregadora de dados (vou fazer versão json e csv)


const d3 = window.d3;

export class Dados {
  constructor() {
    this.data = [];
  }

  chooseCircle(d)
  {
    return {cx: +d.Sales, cy: +d.Profit, col: +d.Discount , cat: d.Category, r:4};
  }

  chooseRect(d)
  {
    return {val: +d.Profit}
  }

  // precisamos do nosso getter para ficar organizado
  getData() {
    return this.data;
  }

  async loadCSV(file) {
    this.data = await d3.csv(file);
    
    // mudar? (deixar ele alternar livremente sobre esse números?)
    this.data = this.data.slice(0, 1000); // pega só os mil primeiros

  }

  async loadJson(file,type) {
    this.data = await d3.json(file);
    // lembrando que a função json não usa arrow function

    this.data = this.data.map((d) => {
      return type === 0 ? this.chooseRect(d) : this.chooseCircle(d); // retorna uma lista de objetos com o profit ( o + converte de string para float)
    });

    this.data = this.data.slice(0, 1000); // pega só os mil primeiros
  }

}
