import {BasicGraph} from './basicGraph.js';

export class Bar extends BasicGraph {
  constructor(config) {

    super(config);
    this.dataTransf = [];
    this.bins = [];
    this.chooseFields(config.fx,config.catScheme, config.numCat);

    // intervalo de valores no eixo x e y
    this.ticks = config.numCat;
    
  }

  chooseFields(x,catScheme,numCat)
  {
     this.binsParams = {x: x, catScheme: catScheme, n: numCat};
  }


    /* 
        transforma os dados após o assign data
    */
   transformData(data)
   {
       const dataTransf = data.map((d) => {
          if(this.binsParams.catScheme == "NUM")
          {
            return {x:  +d[this.binsParams.x]};
          }
          else
          {
            return {x:  d[this.binsParams.x]}; 
          }
        }); 
       this.dataTransf = dataTransf;
   }

   /**
    * criar baseado nos dados que temos as escalas e os bins
    */
   createScales()
   {

      //nesse caso : eixo X (não numérico, conjunto de categorias por exemplo) e Y (e soma de tudo)

      let xExtent;
      let yExtent;

      if(this.binsParams.catScheme == "NUM")
      {

        this.bins = [];

        this.computeBins(this.binsParams.n);
        xExtent = d3.extent(this.dataTransf, d => {
          return d.x;
        });

        yExtent = d3.extent(this.bins, d => {
          return d;
        });

        this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]); 
      
      }
      else
      {
        // estamos lidando com dados categoricos não ordinais
        this.bins = new Map();
        this.dataTransf.forEach((d) => {
          let prevVal = this.bins.get(d.x) ? this.bins.get(d.x) : 0;   
          this.bins.set(d.x, prevVal + 1);
        });

        let catExtent = [];
        for (let [key,value] of this.bins) {
          catExtent.push(key);
        }
        
        this.xScale = d3.scaleBand().domain(catExtent).range([0, this.config.width]).padding(0.2);

        yExtent = d3.extent(this.bins, d => {
          return d[1];
        });

      }

      this.yScale = d3.scaleLinear().domain([0,yExtent[1]]).nice().range([this.config.height,0]);  

   }

  // compute bins (vamos transformar os dados!)
  computeBins(numCategorias) {
    let x = d3.extent(this.dataTransf, d => {
      return d.x;
    });

    let catego = numCategorias;
    let larg = (x[1] - x[0]) / (numCategorias - 1); // tamanho de cada bin do eixo x (max - min )/ (categorias -1)
    // o -1 é para ter um "espaço nos limites"
    // salvando "contadores" em cada categoria (no caso 10)
    for (let id = 0; id < catego; id++) {
      this.bins.push(0);
    }

    // já que a largura de cada barra é um intervalo , vamos jogar valores nesse intervalo !
    this.dataTransf.forEach((d) => {
      let posPlace = Math.floor((d.x - x[0]) / larg); // (ex:  74 - 0 / (100 - 0 / 9)  = 6,6600...) (floor vai jogar para 6)
      this.bins[posPlace] += 1;
    });

    this.bandBins = (this.config.width/ this.bins.length); // evita que os bins fiquem muito colados
  }

  // função matematica de desenhar!
  renderMath() 
  {

    const t = d3.transition().ease(d3.easeLinear).duration(1000);
    const barCanv = this.margins.selectAll('rect').data(this.bins);


    barCanv.enter()
           .append('rect')
           .attr("opacity", 0)
           .attr('x', (d,i) => (i* this.bandBins))
           .attr('y', (d) => this.yScale(d))
           .attr('width' , this.bandBins)
           .attr('height', (d) => this.config.height - this.yScale(d))
           .style('fill', 'Green') 
           .call(en => en.transition(t).attr("opacity",1));

    
    barCanv.exit().call(ex => ex.transition(t).attr("opacity", 0).remove())
    
    barCanv.call(up => up.transition(t)
                         .attr('height' , (d) => this.config.height - this.yScale(d[1]))
                         .attr('x', (d,i) => (i* this.bandBins))
                         .attr('y', (d) => this.yScale(d))
                         .attr('width' , this.bandBins) );
       
  }

  // função categorica de desenhar!
  renderOrd() 
  {

    const t = d3.transition().ease(d3.easeLinear).duration(1000);
    const barCanv = this.margins.selectAll('rect').data(this.bins);


    barCanv.enter()
           .append('rect')
           .attr("opacity", 0)
           .attr('x', (d) => this.xScale(d[0]))
           .attr('y', (d) => this.yScale(d[1]))
           .attr('width' , this.xScale.bandwidth()) 
           .attr('height' , (d) => this.config.height - this.yScale(d[1]))
           .style('fill', 'Green') 
           .call(en => en.transition(t).attr("opacity",1));

    
    barCanv.exit().call(ex => ex.transition(t).attr("opacity", 0).remove())
    
    barCanv.call(up => up.transition(t)
                        .attr('height' , (d) => this.config.height - this.yScale(d[1]))
                        .attr('x', (d) => this.xScale(d[0]))
                        .attr('y', (d) => this.yScale(d[1]))
                        .attr('width' , this.xScale.bandwidth()) );


  }
}
