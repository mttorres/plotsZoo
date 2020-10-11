import {BasicGraph} from './basicGraph.js';

export class ScatterGraph extends BasicGraph 
{
    constructor(config)
    {
        super(config);
        this.circles = [];
        this.circleParams = this.chooseCircle(config.fx, config.fy, config.col, config.colScheme, config.r);
        this.ticks = 15;
        // parâmetros:  cx, cy, se deve ter cores mapeando algum atributo, como esse atributo de cor deve-ser feito (via gradiente de cores ou por cada cor um valor), raio
    }

    /* por a transformação de dados que ficava no dados.js aqui 
       passa os nomes dos campos que devem ser extraídos de cada row (e o tamanho do circle)
    */
    chooseCircle(cx,cy,col, colScheme, r)
    {
      if(col)
      {
        return {cx: cx, cy: cy, col: col, colScheme, r:r};
      }
      return {cx: cx, cy: cy, r:r};
    }

    /* 
        transforma os dados após o assign data
    */
    transformData(data)
    {
        const circles = data.map((d) => {
            return {
                cx:  +d[this.circleParams.cx], 
                cy:  +d[this.circleParams.cy],
                col:  d[this.circleParams.col],
                r:   4,  }}); 
        
        this.circles = circles;
    }

    /**
     * Mesmo método da aula: criar baseado nos dados que temos as escalas!
     */
    createScales()
    {
        // recebe os valores máximos e mínimos
        let xExtent = d3.extent(this.circles, d => {
            return d.cx;
          });
          let yExtent = d3.extent(this.circles, d => {
            return d.cy;
          });

        if(this.circleParams.col)
        {
            if(this.circleParams.colScheme === "CAT")
            {
                const cats = this.circles.map(d=> {d.col}); // obtem todos as categorias
                let catExtent = d3.union(cats); // remove duplicatas (trata a lista como um conjunto, itens únicos)
                this.colScale = d3.scaleOrdinal().domain(catExtent).range(d3.schemeTableau10); 
            }
            else
            {
                let colExtent = d3.extent(this.circles, d => {
                    return d.col;
                });

                this.colScale = d3.scaleSequential(d3.interpolateOrRd).domain(colExtent); 
            }
        }

        this.xScale = d3.scaleLinear().domain(xExtent).nice().range([0, this.config.width]); 
        this.yScale = d3.scaleLinear().domain(yExtent).nice().range([this.config.height, 0]);  

    }


    assignData(data) 
    {
        console.log(`[assignData - debug] data: ${data}`);
        this.transformData(data);
        console.log(`[assignData - debug] transform: ${this.circles}`);
        // cria as escalas
        this.createScales();
        // cria os eixos novos (toda vez que um dado novo é jogado no sistema)
        this.createAxis();
    }

    /*
        Render original usado na aula...
    */

    render()
    {
        this.margins.selectAll('circle')
        .data(this.circles)
        .join('circle')
        .attr('cx', d => this.xScale(d.cx))
        .attr('cy', d => this.yScale(d.cy))
        .attr('r' , d => d.r)
        .attr('fill', d=> this.colScale(d.col));
    }


    /*
        Render usado para fazer as "transições" (enter,update,delete) (se livrar das cores das categorias se for o caso)
    */ 
    renderT()
    {

    }

}