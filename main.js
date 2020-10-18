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

*/

function dataLinear2xProGeneretor()
{
    let data = [];
    for(let i = 1; i < 100; i++)
    {
      //data[i] = {x: i , y: 2*i };
      data.push({x: i , y: 2*i });
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

  // vai ser um input
  let c = {div: "#main", width: 800, height: 600, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
            fx: 'x', fy: 'y', col: "Category" , colScheme: 'CAT', r: 'r'};

  // vai ter um input para escolher o grafico da vez
  
  //let bar = new Bar(c);

  //let sp = new ScatterGraph(c); 

  let lp = new LineGraph(c); 



  // sempre teremos isso
  //bar.setData(dados.getData());
  //sp.assignData(dados.getData());
  lp.assignData(dataLinear2xProGeneretor());

  // e isso
  //bar.render();
  //sp.render();
  lp.render();

  console.log("esperando...");
  setTimeout(() => {
    {
      c['fx'] = fx;
      c['fy'] = fy;
      lp.config = c;
      lp.chooseLine(c.fx,c.fy);
      lp.assignData(dados.getData());
      lp.render();
    }
  }, 10000);
}

main();