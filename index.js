const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;

let mensagem = "Bem-Vindo ao app de metas";
let metas = [];

const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf-8");
    metas = JSON.parse(dados);
  } catch (erro) {}
};
const cadastrarMeta = async () => {
  const meta = await input({ message: "digite a meta:" });

  if (meta.length == 0) {
    mensagem = "meta não pode ser vazia.";
    return;
  }
  metas.push({
    value: meta,
    checked: false,
  });
  mensagem = "Meta cadastrada com sucesso";
};

const listarMetas = async () => {
  if (metas.lenght == 0) {
    mensagem - "não há metas";
    return;
  }
  const respostas = await checkbox({
    message:
      "use as setas para mudar de meta, o espaço para marcar ou desmar e o Enter para finalizar essa etapa",
    choices: [...metas],
    instructions: false,
  });
  metas.forEach((m) => {
    m.checked = false;
  });
  if (respostas.length == 0) {
    mensagem = "nenhuma meta selecionada";
    return;
  }

  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta;
    });
    meta.checked = true;
  });
  mensagem = "meta(s) marcadas como concluida(s)";
};

const metasRealizadas = async () => {
  if (metas.lenght == 0) {
    mensagem - "não há metas";
    return;
  }
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });
  if (realizadas.length == 0) {
    mensagem = "não há metas realizadas";
    return;
  }
  await select({
    message: "Metas Realizadas: " + realizadas.length,
    choices: [...realizadas],
  });
};

const metasAbertas = async () => {
  if (metas.lenght == 0) {
    mensagem - "não há metas";
    return;
  }
  const abertas = metas.filter((meta) => {
    return !meta.checked;
  });
  if (abertas.length == 0) {
    mensagem = "não existem metas aberta!";
    return;
  }
  await select({
    message: "Metas Abertas: " + abertas.length,
    choices: [...abertas],
  });
};

const removerMetas = async () => {
  if (metas.lenght == 0) {
    mensagem - "não há metas";
    return;
  }
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });
  const itensADeletar = await checkbox({
    message:
      "use as setas para mudar de meta, o espaço para marcar ou desmar e o Enter para finalizar essa etapa",
    choices: [...metasDesmarcadas],
    instructions: false,
  });
  if (itensADeletar.length == 0) {
    console.log("Nenhum item a deletar");
    return;
  }
  itensADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item;
    });
  });
  mensagem = "metas deletadas com sucesso";
};
const mostrarMensagem = () => {
  console.clear();

  if (mensagem != "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
};

const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};
const start = async () => {
  await carregarMetas();
  await salvarMetas();
  while (true) {
    mostrarMensagem();
    const opcao = await select({
      message: "Menu >",
      choices: [
        {
          name: "Cadastrar meta",
          value: "cadastrar",
        },
        {
          name: "Listar metas",
          value: "listar",
        },
        {
          name: "Metas Realizadas",
          value: "realizadas",
        },
        {
          name: "Metas Abertas",
          value: "abertas",
        },
        {
          name: "Remover metas",
          value: "remover",
        },
        {
          name: "Sair",
          value: "sair",
        },
      ],
    });
    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        await salvarMetas();
        console.log(metas);
        break;

      case "listar":
        await listarMetas();
        await salvarMetas();
        break;

      case "realizadas":
        await metasRealizadas();
        break;

      case "abertas":
        await metasAbertas();
        break;

      case "remover":
        await removerMetas();
        await salvarMetas();
        break;
      case "sair":
        console.log("até a próxima");
        return;
    }
  }
};

start();
