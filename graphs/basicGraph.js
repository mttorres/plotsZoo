

export class BasicGraph
{
    constructor(config)
    {
        this.config = config;
        this.margins = null;

        this.xScale = null;
        this.yScale = null;

        this.createSvg();
        this.createMargins();
    }

    // criação básica de svg comas definições de margem
    createSvg()
    {
        this.svg = d3.select(this.config.div)
        .append("svg")
        .attr('x',this.config.posX)
        .attr('y',this.config.posY)
        .attr('width', this.config.width + this.config.left*2 + this.config.right+100)  
        .attr('height', this.config.height + this.config.top + this.config.bottom * 2 ); 
    }

    // criação do grupo(novo mini svg) que vai ser transaladado para respeitar a margen
    createMargins()
    {
        // novo svg transladado
        this.margins = this.svg
            .append('g')
            .attr("transform",`translate(${this.config.left},${this.config.top})`); // criamos o "grupo", local que iremos por nossos objetos svg e ele vai ser transladado pelas margens
            // pelo oque parece todo mundo desse grupo já vai estar naturalmente transladado
    }

    // vamos criar os eixos agora!
    createAxis()
    {
        // já que vamos atualizar os dados do gráficos o eixo deve sempre atualizar esse xAxis, yAxis a cada update!
        // já que esses são "intervalos" escalados de acordo com os dados ! (dados(extent(min,max)) ->  pixels(min,max))
        
/*        
        let xAxis = d3.axisBottom(this.xScale).ticks(15);
        let yAxis = d3.axisLeft(this.yScale).ticks(15); // eixos com 15 marcas

        this.margins
            .append("g") // criar grupo que vai conter os elementos que fazem parte do eixo (que na verdade são os dados são valores da margem!)
            .attr("transform",`translate(0,${this.config.height})`)  // transladar na altura da área de desenho (os eixos usam os valores (dados) da escala mas eles não se submetem a ela! (nesse caso))
            .call(xAxis);  // a função xAxis vai ser chamada e o argumento dela vai ser o grupo g que foi criado!

        this.margins
            .append("g")
            .call(yAxis);            
*/
        // vamos por enquanto só criar os grupos dos eixos x e y 

        let xAxis = d3.axisBottom(this.xScale).ticks(this.ticks);

        let yAxis = d3.axisLeft(this.yScale).ticks(this.ticks)

        this.margins
            .append("g") 
            .attr('class','ei-x')
            .attr("transform",`translate(0,${this.config.height})`)
            .call(xAxis);  
            
        this.margins
            .append("g")
            .attr('class','ei-y')
            .call(yAxis);  
             

    }


    nameAxis()
    {

        const labelX = this.labelX ? this.labelX : '';
        const labelY = this.labelY ? this.labelY : '';

        this.svg.append('text')
                .attr('class', 'name-x')
                .style('font-size', '25px')
                .attr('transform',`translate(${(this.config.width + this.config.left * 2 + this.config.right + 30) / 2},${
              this.config.height + this.config.top + this.config.bottom})`,)
                .attr('dy', '0.5em')
                .style('text-anchor', 'middle')
                .text(labelX);
    
                this.svg.append('text')
                .attr('class', 'name-y')
                .style('font-size', '25px')
                .attr('transform',`translate(${(this.config.left + 15) },${
               this.config.top-30})`,)
                .attr('dy', '0.5em')
                .style('text-anchor', 'middle')
                .text(labelY);
    }


    updateAxis()
    {
        let t = this.margins.transition().duration(600);

        let xAxis = d3.axisBottom(this.xScale).ticks(this.ticks);

        let yAxis = d3.axisLeft(this.yScale).ticks(this.ticks);
    
        this.margins
          .selectAll('.ei-x')
          .attr('transform', `translate(0,${this.config.height})`)
          .call(c => 
            {
                c.attr("opacity", 0).transition(t).ease(d3.easeLinear)
                .attr("opacity", 1);
                xAxis(c);
            });
    
        this.margins.selectAll('.ei-y').call(c => 
            {
                c.attr("opacity", 0).transition(t).ease(d3.easeLinear)
                .attr("opacity", 1);
                yAxis(c);
            });

        const labelX = this.labelX ? this.labelX : '';
        const labelY = this.labelY ? this.labelY : '';
        
        let tsvg = this.svg.transition().duration(600);

        this.svg.selectAll('.name-x').call( c => {
                c.attr("opacity", 0).transition(tsvg).ease(d3.easeLinear)
                .text(labelX)
                .attr("opacity", 1);
                
            });

        this.svg.selectAll('.name-y').call( c => {
                c.attr("opacity", 0).transition(tsvg).ease(d3.easeLinear)
                .text(labelY)
                .attr("opacity", 1);
                
            });
    }

    assignData(data) 
    {
        let updateFlag = false;
        if(this.xScale && this.yScale){
            updateFlag = true;
        }
        
        this.transformData(data);
        
        // cria as escalas
        this.createScales();

        // porem antes

        this.nameAxis();

        // cria ou atualiza os eixos novos (toda vez que um dado novo é jogado no sistema)
        
        if(updateFlag)
        {
            this.updateAxis();
        }
        else
        {
            this.nameAxis();
            this.createAxis();
        }
        
    }
    
}