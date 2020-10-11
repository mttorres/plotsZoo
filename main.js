import { Dados } from './data/dados.js'
import { Bar   } from './graphs/barGraph.js'
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


async function main() {
  
  // sempre será essa classe para carregar nossos dados
  let dados = new Dados();

  // path (tipo de dado pode mudar ou será input)
  await dados.loadCSV('../../../datasets/superstore.csv');

  // vai ser um input
  let c = {div: "#main", width: 800, height: 600, top: 40, left: 40, bottom: 40, right: 40 , posX: 10, posY: 10,
            fx: 'Sales', fy: 'Profit', col: "Category" , colScheme: 'CAT', r: 'r'};

  // vai ter um input para escolher o graficod a vez
  
  //let bar = new Bar(c);

  let sp = new ScatterGraph(c); 

  
  // sempre teremos isso
  //bar.setData(dados.getData());
  sp.assignData(dados.getData());


  // e isso
  //bar.render();

  sp.render();
}

main();