const venom = require('venom-bot');
const xlsx = require('xlsx');

// Carregar a planilha
function carregarContatos(arquivo) {
  const workbook = xlsx.readFile(arquivo);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const contatos = xlsx.utils.sheet_to_json(sheet);
  return contatos; // Retorna uma lista de objetos [{ Nome, Telefone }]
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

  // Mensagem a ser enviada
  const mensagem = 'Olá, [NOME]! Estamos entrando em contato para informar que não estamos nem aí pro que vc pensa\n\r.';

  for (const contato of contatos) {
    const nome = contato['Nome do cliente'];
    const telefone = contato['Telefone'];

    if (telefone) {
      const mensagemPersonalizada = mensagem.replace('[NOME]', nome);

      try {
        // Envia a mensagem
        await client.sendText(`${telefone}@c.us`, mensagemPersonalizada);
        console.log(`Mensagem enviada para ${nome} (${telefone})`);
      } catch (error) {
        console.error(`Erro ao enviar mensagem para ${nome} (${telefone}):`, error);
      }
    } else {
      console.error(`Telefone inválido para ${nome}`);
    }
  }

  console.log('Envio concluído.');
}
