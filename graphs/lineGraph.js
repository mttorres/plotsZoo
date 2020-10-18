import {BasicGraph} from './basicGraph.js';

export class LineGraph extends BasicGraph 
{
    constructor(config)
    {
        super(config);
        this.lineSeg = [];
        this.chooseLine(config.fx, config.fy);
        this.ticks = 15;
        this.lineDefinitions = d3.line()
                                .x(d => this.xScale(d.x))
                                .y(d => this.yScale(d.y));
        
        // select inicial
        this.lineCanvas = this.margins.append("path").attr('class','lineCanv');
    }

    /* passa os nomes dos campos que devem ser extraídos de cada row
    */
    chooseLine(x,y)
    {
        debugger;
        this.lineParams = {x: x, y: y};
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

    render()
    {

        //const lineScale = this.lineSeg.map((d) => { return { x: this.xScale(d.x), y: this.yScale(d.y) } });
        let t = this.margins.transition().duration(1500);

        // select inicial 
        //let line = this.margins.selectAll('path').datum(this.lineSeg);
        //let line = this.margins.selectAll('.lineCanv').datum(this.lineSeg);

        let line = this.margins.selectAll('path.lineCanv').datum(this.lineSeg);

 /*       

        line.join(
            en => en.append("path")
            .attr("class","line")
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", (d) => { return this.lineDefinitions(d); } ),
        
            up => up.style('stroke', 'SeaGreen')
                    .attr("d", (d) => { return this.lineDefinitions(d); } ),
        
            ex => ex.style("stroke", "IndianRed")
            .call(ex => ex.transition(t).remove())
        );

*/

        line.join('path')
        .attr('class','lineCanv')
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 1.5)
        .attr("d", this.lineDefinitions)
        .call(up => up.style('stroke','SeaGreen').attr("opacity", 0).transition(t).ease(d3.easeLinear).attr("opacity", 1));
        
/*
        // enter
        this.lineCanv.datum(this.lineSeg).enter()
            .append('path')
            .attr("fill", "none")
            .attr("stroke", "RoyalBlue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", this.lineDefinitions);

        //exit
        this.lineCanv.datum(this.lineSeg).exit()
              .attr("fill", "none")
              .attr("stroke", "IndianRed")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .call(ex => ex.transition(t).remove());

        // update
        this.lineCanv.datum(this.lineSeg)
              .attr("fill", "none")
              .attr("stroke", "purple")
              .attr("stroke-width", 1.5)
              .attr("stroke-linejoin", "round")
              .attr("stroke-linecap", "round")
              .call(up => up.transition(t));
 
*/
 
  /*  
        this.margins.append("path")
            .datum(this.lineSeg)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", this.lineDefinitions);

*/            
    
    }

}