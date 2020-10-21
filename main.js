import { Dados } from './data/dados.js'
import { Bar   } from './graphs/barGraph.js'
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

async function updateChart(dados,c,t)
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

  if(dados)
  {
    if(dados.getData)
    {
      t.assignData(dados.getData());
    }
    else
    {
      t.assignData(dados);
    }
  }
  else
  {
     dados = new Dados();
     if(c.path.slice(-3,-1) === "cs")
     {
       await dados.loadCSV(c.path);
       window.myScopeOb.dados = dados;
     }
     else
     {
        alert("DANGER");
     }
     t.assignData(dados.getData());
  }



  if(t instanceof Bar){
    if(c.catScheme === "NUM"){
      t.renderMath();
    }
    else{
      t.renderCat();
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

  return {graph: sp, dados: dados};

}


async function initLine(c)
{

  let lp = new LineGraph(c); 

  let dados = dataLinear2xProGeneretor(1,100,1);
  lp.assignData(dados);       
  lp.render();

  console.log("esperando...");
  setTimeout(() => {
    {
      dados = dataLinear2xProGeneretor(20,70,2)
      updateChart(dados,c,lp);
      //c['fx'] = fx;
      //c['fy'] = fy;
      //lp.config = c;
      //lp.chooseLine(c.fx,c.fy);
      //lp.assignData(dados.getData());

      
    }
  }, 10000);

  return {graph: lp, dados: dados};

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

  return {graph: bp, dados: dados};

}


async function plotini()
{
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const plot_type = urlParams.get('plot')
  console.log(plot_type);


  let ob;

  if(plot_type === "scatter")
  {
    // vai ser um input na proxima vez
    
    document.getElementById("catScheme").style.display  = "None"; 
    
    var c = {path: '../../../datasets/superstore.csv', div: "#main", width: 750, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: 'Sales', fy: 'Profit', col: "Category" , colScheme: 'CAT', r: 'r', ticks: 15};
    ob = await initScatter(c);

    ob.c = c;
    return  ob;

  }
  if(plot_type === "bar"){
    
    document.getElementById("col").style.display  = "None"; 
    document.getElementById("colScheme").style.display  = "None"; 
    document.getElementById("fy").style.display  = "None"; 

    var c = {path: '../../../datasets/superstore.csv', div: "#main", width: 800, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: "Profit", catScheme: 'NUM', numCat: 15};
    ob = await initBar(c);

    ob.c = c;
    return  ob;
  }
  if(plot_type === "line"){

    document.getElementById("catScheme").style.display  = "None";

    document.getElementById("col").style.display  = "None"; 
    document.getElementById("colScheme").style.display  = "None"; 

    var c = {div: "#main", width: 750, height: 500, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
    fx: 'x', fy: 'y', ticks: 15 };
    ob = await initLine(c);

    ob.c = c;
    return  ob;

  }


}


window.onload = () =>{
  main();
}

async function sub(){ 
  
  debugger;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const plot_type = urlParams.get('plot');
  
  let pathInput = document.getElementById("path").children[1].value;
  let path = pathInput?  pathInput : null;

  let pathValidation;
  if(path !== null){
    var http = new XMLHttpRequest();
    http.open('GET', path, false);
    http.send();
    pathValidation = http.status !== 404;;
    
  }

  window.myScopeOb.c.path = pathValidation? path : window.myScopeOb.c.path;
  window.myScopeOb.dados = pathValidation? null : window.myScopeOb.dados;

  let fx = document.getElementById("fx").children[1].value;
  window.myScopeOb.c.fx = fx? fx : window.myScopeOb.c.fx;

  if(plot_type === "bar")
  {

    let catScheme = document.getElementById("catScheme").children[1].value;

    window.myScopeOb.c.catScheme = catScheme? catScheme : window.myScopeOb.c.catScheme;
  }

  if(plot_type === "line")
  {
    let fy = document.getElementById("fy").children[1].value;

    window.myScopeOb.c.fy = fy? fy : window.myScopeOb.c.fy;
    
  }

  if(plot_type === "scatter")
  {
    let fy = document.getElementById("fy").children[1].value;
    window.myScopeOb.c.fy = fy? fy : window.myScopeOb.c.fy;

    let col = document.getElementById("col").children[1].value;
    window.myScopeOb.c.col = col? col : window.myScopeOb.c.col;

    let colScheme = document.getElementById("colScheme").children[1].value;
    window.myScopeOb.c.colScheme = colScheme? colScheme : window.myScopeOb.c.colScheme;



  }

  updateChart(window.myScopeOb.dados,window.myScopeOb.c,window.myScopeOb.graph);

}



async function main()
{

  document.getElementById("sub").onclick = sub;  

  var graph; 
  var c;
  var ob;

  ob = await plotini();  
  window.myScopeOb = ob;
  
  graph = ob.graph;
  c = ob.c;

  setInterval( () => 
    {
      console.log(window.myScopeOb);
    }
     , 3000);
}