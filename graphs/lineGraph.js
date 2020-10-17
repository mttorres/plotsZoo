import {BasicGraph} from './basicGraph.js';

export class LineGraph extends BasicGraph 
{
    constructor(config)
    {
        super(config);
        this.lineSeg = [];
        this.lineParams = this.chooseLine(config.fx, config.fy);
        this.ticks = 15;
        // parâmetros:  cx, cy, se deve ter cores mapeando algum atributo, como esse atributo de cor deve-ser feito (via gradiente de cores ou por cada cor um valor), raio
    }

    /* passa os nomes dos campos que devem ser extraídos de cada row
    */
    chooseLine(x,y)
    {
        return {x: x, y: y};
    }

    /* 
        transforma os dados após o assign data
    */
    transformData(data)
    {
        const lineSeg = data.map((d) => {
            return {
                x:  +d[this.lineParams.x], 
                y:  +d[this.lineParams.y],
            
            }}); 
        
        this.lineSeg = lineSeg;
    }

    createScales()
    {
        // recebe os valores máximos e mínimos
        let xExtent = d3.extent(this.lineSeg, d => {
            return d.x;
          });
          let yExtent = d3.extent(this.lineSeg, d => {
            return d.y;
          });

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

        const lineScale = this.lineSeg.map((d) => { return { x: this.xScale(d.x), y: this.yScale(d.y) } });

        const t = this.margins.transition().duration(1500);

        // select inicial
        let line = this.margins.selectAll('path').data(lineScale);

        // enter
        line.enter()
              .append('path')
              .attr("fill", "none")
              .attr("stroke", "RoyalBlue")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("d", lineScale)
              .call(en => en.transition(t));

        //exit
        line.exit()
              .attr("fill", "none")
              .attr("stroke", "IndianRed")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .call(ex => ex.transition(t).remove());

        // update
        line.attr("fill", "none")
              .attr("stroke", "purple")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .attr("d", lineScale)
              .call(up => up.transition(t));
    }

}