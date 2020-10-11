const d3 = window.d3;

export class Bar {
  constructor(config) {

    this.config = config;
    this.rawData = [];
    this.bins = [];
    // intervalo de valores no eixo x e y
    this.x = [Infinity, -Infinity];
    this.y = [Infinity, -Infinity];

    // informações de escala (marcadores)

    this.xScale = null;
    this.yScale = null;

    this.colScale = null;
    this.catScale = null;    
    
    
    this.w = this.config.width;
    this.h = this.config.height;

    this.createSvg();
  }

  createSvg() {
    this.svg = d3
      .select("#main")
      .append("svg")
      .attr("x", this.config.posX)
      .attr("y", this.config.posY)
      .attr("width", this.w)
      .attr("height", this.h);
  }

  // compute bins (vamos transformar os mil dados!)
  computeBins(numCategorias) {
    //console.log("[computeBins] data:  " + this.data);
    //console.log("[computeBins] length:  " + this.data.length);
    let x = d3.extent(this.data, d => {
      return d.val;
    });

    // retorna os vetores [min,max] do eixo X

    // criando o número máximo de colunas (categorias) !
    // e largura de cada barra (bin)

    let catego = numCategorias;
    let larg = (x[1] - x[0]) / (numCategorias - 1); // tamanho de cada bin do eixo x (max - min )/ (categorias -1)
    // o -1 é para ter um "espaço nos limites"
    // salvando "contadores" em cada categoria (no caso 10)
    for (let id = 0; id < catego; id++) {
      this.bins.push(0);
    }

    // já que a largura de cada barra é um intervalo , vamos jogar valores nesse intervalo !
    this.data.forEach((d) => {
      let posPlace = Math.floor((d.val - x[0]) / larg); // (ex:  74 - 0 / (100 - 0 / 9)  = 6,6600...) (floor vai jogar para 6)
      this.bins[posPlace] += 1;
    });
  }


  // nosso setter!
  setData(data) {
    this.data = data;
    this.computeBins(10); // por enquanto hard coded 
    this.y = d3.extent(this.bins); // sabemos o maior e menor y para criar o eixo
  }

  // vai ditar as posições dos objetos dentro da ESCALA DO GRUPO G 
  createScales()
  {

        let xExtent = d3.extent(this.circles, d => {
            return d.cx;
          });
          let yExtent = d3.extent(this.circles, d => {
            return d.cy;
          });
          let colExtent = d3.extent(this.circles, d => {
            return d.col;
          });
      

        const cats = this.circles.map(d=> {d.cat}); // obtem todos as categorias
        let catExtent = d3.union(cats); // remove duplicatas (trata a lista como um conjunto, itens únicos)


                                                                    // não deveria ser left aqui? (apesar que já estamos transladados para a left (o G esta))
        this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]); // poderia escalar - rigth e no de baixo,  - bottom!
        this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]); // "invertido"        
        
        this.colScale = d3.scaleSequential(d3.interpolateOrRd).domain(colExtent); // interpola um "esquema de cores do valor" (não precisa do range do canal visual laranja par vermelho nesse caso)
        // só usa range se quiser fazer um interpolador personalizado!
        
        this.catScale = d3.scaleOrdinal().domain(catExtent).range(d3.schemeTableau10); // usa  escala ordinal: categoria "segue ordens", não é um intervalo por não ser quantitativo nem sequencial poque não usamos interpolação
        // mas tem uma lista qualquer como domínio que representa uma possiblidade de valores (que enquadram) para os seus dados 
        // e no caso a gente para cada elemento do domínio a gente associa um scheme de cores (só para diferenciar as categorias)
        // a única restrição é que o número de cores deve bater com todas as categorias! 

        // nice serve para arredondamento!
  }   



  // função principal de desenhar!
  render() 
  {
    this.svg.selectAll('rect')
    .data(this.bins)
    .join('rect')   // para cada bin, fazer mapeamento em pixels  
    .attr('x', (d, i) => i * this.w / this.bins.length + 10) // para cada indice (cada bin), teremos: indice X largura / total de barras (+10 para não ficar colado) 
    .attr('y', d => this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) )) // mapeando valores de 1 para pixels... para proporção
    .attr('width' , () => this.w / 10 - 20) // o grafico não precisa ocupar tudo não... fica bem grudado
    .attr('height' , d => this.h - this.h * ( 1 - (d - this.y[0]) / (this.y[1] - this.y[0]) )) // mesma coisa de antes para y
    .style('fill', 'RoyalBlue')
  }
}
