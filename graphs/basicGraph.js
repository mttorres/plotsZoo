

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
        //this.createAxis();
    }

    // criação básica de svg comas definições de margem
    createSvg()
    {
        this.svg = d3.select(this.config.div)
        .append("svg")
        .attr('x',this.config.posX)
        .attr('y',this.config.posY)
        .attr('width', this.config.width + this.config.left + this.config.right)  
        .attr('height', this.config.height + this.config.top + this.config.bottom ); 
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
            .attr("transform",`translate(0,${this.config.height})`)
            .call(xAxis);  
            
        this.margins
            .append("g")
            .call(yAxis);  
             

    }
    
}