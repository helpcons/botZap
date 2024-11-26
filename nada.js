const venom = require('venom-bot');
const xlsx = require('xlsx');
const path = require('path');

// Carregar a planilha
function carregarContatos(arquivo) {
  const workbook = xlsx.readFile(arquivo);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const contatos = xlsx.utils.sheet_to_json(sheet);
  return contatos; // Retorna uma lista de objetos [{ Nome, Telefone }]
}

// Função para esperar (time em milissegundos)
function esperar(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

// Inicializa o bot
venom
  .create({
    session: 'session-name' //name of session
  })
  .then((client) => start(client))
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });

// Função principal do bot
async function start(client) {
  console.log('Bot iniciado com sucesso!');

  // Carrega os contatos da planilha
  const contatos = carregarContatos('contatos.xlsx');
  console.log(`Carregados ${contatos.length} contatos.`);

  // Caminho da imagem a ser enviada
  const caminhoImagem = path.resolve('convite.jpeg'); // Coloque o arquivo na mesma pasta do script

  // Mensagem a ser enviada com a imagem
  const legenda = 'Robô de Teste\r\nParticipe do evento no dia!';

  for (const contato of contatos) {
    const nome = contato['Nome do cliente'];
    const telefone = contato['Telefone'];

    if (telefone) {
      try {
        // Envia a imagem com a legenda
        await client.sendImage(
          `${telefone}@c.us`, // Número do destinatário no formato internacional
          caminhoImagem, // Caminho da imagem
          'convite', // Nome do arquivo para o WhatsApp
          `${legenda} [NOME]`.replace('[NOME]', nome) // Mensagem com o nome personalizado
        );

        console.log(`Imagem enviada para ${nome} (${telefone})`);
      } catch (error) {
        console.error(`Erro ao enviar imagem para ${nome} (${telefone}):`, error);
      }

      // Aguarda 5 segundos antes de enviar a próxima mensagem
      await esperar(5000);
    } else {
      console.error(`Telefone inválido para ${nome}`);
    }
  }

  console.log('Envio concluído.');
}
