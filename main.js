import { Dados } from './data/dados.js'
import { Bar   } from './graphs/barGraph.js'
import { BasicGraph } from './graphs/basicGraph.js';
import { LineGraph } from './graphs/lineGraph.js';
import {ScatterGraph} from './graphs/ScatterGraph.js'



/*

  3 gráficos : barras, scatter, linhas
  
  atualização dos dados: e a modificação deve ser realçada (enter, delete, update)
  
  criar instâncias independentes dos gráficos: Mais
  especificamente, o usuário da biblioteca deve ser capaz de criar novas instâncias dos
  tipos de gráficos(escolhe cada um) que compõem a biblioteca sempre que fornecer o identificador do
  elemento HTML(#geralmente é sempre o main... a não ser que a gente de append com outro id?) 
  onde o mesmo deve ser posicionado e o conjunto de dados que deve
  ser considerado (escolhe o dataset de input?).
  
  parâmetros de entrada: (a) largura e altura do gráfico, (b) dimensões da margem, (c)
  escolha dos textos do label dos eixos x e y.




/*
  todo:  
  
  criar 3 paginas
    para cada uma dessas:
      criar grafico (padrão)
      criar botão de update -> update random ? ou pelas ações da configuração?
      extra: criar botão que troca as dimensões (escrever? escolher?)


*/ 

function dataLinear2xProGeneretor(min,max,f)
{
    let data = [];
    for(let i = min; i < max; i++)
    {
      //data[i] = {x: i , y: 2*i };
      data.push({x: i , y: (2*i)**f });
    }
    return data;
}


async function main() {
  
  // sempre será essa classe para carregar nossos dados
  let dados = new Dados();

  // path (tipo de dado pode mudar ou será input, ou será alguma relação de função ex 2x)
  await dados.loadCSV('../../../datasets/superstore.csv');
  // vai receber os campos para serem passados:
  let fx = 'Sales';
  let fy = 'Profit';

/*  
  // vai ser um input
  let c = {div: "#main", width: 500, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
            fx: 'x', fy: 'y', col: "Category" , colScheme: 'CAT', r: 'r'};

  // vai ter um input para escolher o grafico da vez
  
  

  //let sp = new ScatterGraph(c); 

  let lp = new LineGraph(c); 



  // sempre teremos isso
  //sp.assignData(dados.getData());
  lp.assignData(dataLinear2xProGeneretor(1,100,1));

  // e isso
  //bar.render();
  //sp.render();
  lp.render();

  console.log("esperando...");
  setTimeout(() => {
    {

      lp.assignData(dataLinear2xProGeneretor(20,70,2));
      //c['fx'] = fx;
      //c['fy'] = fy;
      //lp.config = c;
      //lp.chooseLine(c.fx,c.fy);
      //lp.assignData(dados.getData());
      lp.render();
    }
  }, 10000);

  let c2 = {div: "#main", width: 500, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
            fx: fx, fy: fy, col: "Discount" , colScheme: 'INTER', r: 'r'};

            // interpola numeros ou categorias com cores diferentes


  let sp = new ScatterGraph(c2);    
  sp.assignData(dados.getData());       
  sp.render();

  */

  let c3 = {div: "#main", width: 800, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
  fx: "Profit", catScheme: 'NUM', numCat: 15};
        // categorias 
        // ou bins de numeros (arredonda e joga ele em intervalos arredondados tmb)

  let c4 = {div: "#main", width: 800, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
  fx: "Category", catScheme: 'CAT'};

  

  //let bar = new Bar(c4);
  //bar.assignData(dados.getData());
  bar.renderOrd();

  
  //let barM = new Bar(c3);
  //barM.assignData(dados.getData());
  //barM.renderMath();

}

//main();


function updateChart(dados,c,t)
{
  if(t instanceof ScatterGraph){
    t.chooseCircle(c.fx, c.fy, c.col, c.colScheme, c.r);
  }

  if(t instanceof LineGraph){
    t.chooseLine(c.fx,c.fy);
  }

  if(t instanceof Bar){
    t.chooseFields(c.fx,c.catScheme,c.numCat);
  }



  if(dados.getData)
  {
    t.assignData(dados.getData());
  }
  else
  {
    t.assignData(dados);
  }

  if(t instanceof Bar){
    if(c.catScheme === "NUM"){
      t.renderMath();
    }
    else{
      t.renderOrd();
    }
  }
  else{
    t.render();
  }
  

}



async function initScatter(c)
{
  // default (primeira vez)
  let dados = new Dados();
  await dados.loadCSV(c.path);

  let sp = new ScatterGraph(c); 

  sp.assignData(dados.getData());       
  sp.render();

  console.log("esperando...");
  setTimeout(() => {
    {
      c.fx = "Shipping Cost";
      c.fy = "Sales";     
      c.col = "Discount"
      c.colScheme = "INTER"; 
      updateChart(dados,c,sp);
    }
  }, 10000);


}


async function initLine(c)
{

  let lp = new LineGraph(c); 

  lp.assignData(dataLinear2xProGeneretor(1,100,1));       
  lp.render();

  console.log("esperando...");
  setTimeout(() => {
    {

      updateChart(dataLinear2xProGeneretor(20,70,2),c,lp);
      //c['fx'] = fx;
      //c['fy'] = fy;
      //lp.config = c;
      //lp.chooseLine(c.fx,c.fy);
      //lp.assignData(dados.getData());
    }
  }, 10000);


}

async function initBar(c)
{
  let dados = new Dados();
  await dados.loadCSV(c.path);

  let bp = new Bar(c); 

  bp.assignData(dados.getData());       
  bp.renderMath();

  console.log("esperando...");
  setTimeout(() => {
    {

      c.fx = "Category";
      c.catScheme = "CAT";
      updateChart(dados,c,bp);
    }
  }, 10000);
}


async function testMainNew()
{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const plot_type = urlParams.get('plot')
  console.log(plot_type);

  if(plot_type === "scatter"){
    // vai ser um input na proxima vez
    
    document.getElementById("catScheme").style.display  = "None"; 
    
    var c = {path: '../../../datasets/superstore.csv', div: "#main", width: 750, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: 'Sales', fy: 'Profit', col: "Category" , colScheme: 'CAT', r: 'r', ticks: 15};
    initScatter(c);
  }
  if(plot_type === "bar"){
    
    document.getElementById("col").style.display  = "None"; 
    document.getElementById("colScheme").style.display  = "None"; 

    var c = {path: '../../../datasets/superstore.csv', div: "#main", width: 800, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: "Profit", catScheme: 'NUM', numCat: 15};
    initBar(c);
  }
  if(plot_type === "line"){

    document.getElementById("catScheme").style.display  = "None";

    document.getElementById("col").style.display  = "None"; 
    document.getElementById("colScheme").style.display  = "None"; 

    var c = {div: "#main", width: 750, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: 'x', fy: 'y', ticks: 15 };
    initLine(c);
  }

  

}


function validateForm() {
  var x = document.forms["myForm"]["fname"].value;
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
}

testMainNew();