const containerPiadas = document.getElementById('containerPiadas');
const obterTodasBtn = document.getElementById('obterTodasBtn');
const criarFormularioBtn = document.getElementById('criarFormularioBtn');
const formularioCriacao = document.getElementById('formularioCriacao');
const formCriacao = document.getElementById('formCriacao');
const visualizarCriadasBtn = document.getElementById('visualizarCriadasBtn');
const editarPiadaBtn = document.getElementById('editarPiadaBtn');

document.addEventListener('DOMContentLoaded', obterTodasPiadasSalvas);
obterTodasBtn.addEventListener('click', obterTodasPiadas);
criarFormularioBtn.addEventListener('click', () => exibirFormularioCriacao(true));
formCriacao.addEventListener('submit', adicionarPiada);
visualizarCriadasBtn.addEventListener('click', visualizarPiadasSalvas);
editarPiadaBtn.addEventListener('click', editarPiadaSalva);


function obterTodasPiadas() {
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(piada => {
            const cartao = criarCartaoPiada(piada);
            containerPiadas.innerHTML = '';
            containerPiadas.appendChild(cartao);
        });
}

function obterTodasPiadasSalvas() {
    const piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];
    
    piadasSalvas.forEach(piada => {
        const cartao = criarCartaoPiada(piada);
        containerPiadas.appendChild(cartao);
    });
}

function exibirFormularioCriacao(exibir) {
    const overlay = document.getElementById('overlay');

    if (exibir) {
        formularioCriacao.style.display = 'block';
        overlay.style.display = 'block'; 
    } else {
        formularioCriacao.style.display = 'none';
        overlay.style.display = 'none';
    }
}

function adicionarPiada(event) {
    event.preventDefault();

    const descricaoPiada = document.getElementById('descricaoPiada').value;
    const respostaPiada = document.getElementById('respostaPiada').value;

    const novaPiada = {
        setup: descricaoPiada,
        punchline: respostaPiada,
        id: Date.now(),
    };

    const piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];
    piadasSalvas.push(novaPiada);
    localStorage.setItem('piadas', JSON.stringify(piadasSalvas));

    const cartao = criarCartaoPiada(novaPiada);
    containerPiadas.appendChild(cartao);

    formCriacao.reset();
    exibirFormularioCriacao(false); 
}

function visualizarPiadasSalvas() {
    containerPiadas.innerHTML = '';

    const piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];

    if (piadasSalvas.length === 0) {
        const mensagem = document.createElement('p');
        mensagem.textContent = 'Você ainda não criou piadas.';
        containerPiadas.appendChild(mensagem);
    } else {
        piadasSalvas.forEach(piada => {
            const cartao = criarCartaoPiada(piada);
            containerPiadas.appendChild(cartao);
        });
    }
}

function editarPiadaSalva(idPiada) {
    const piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];
    const piadaParaEditar = piadasSalvas.find(piada => piada.id === idPiada);

    if (piadaParaEditar) {
        const novaDescricao = prompt('Nova descrição:', piadaParaEditar.setup);
        const novaResposta = prompt('Nova resposta:', piadaParaEditar.punchline);

        piadaParaEditar.setup = novaDescricao;
        piadaParaEditar.punchline = novaResposta;

        localStorage.setItem('piadas', JSON.stringify(piadasSalvas));
        visualizarPiadasSalvas();
    } else {
        alert('ID de piada não encontrado.');
    }
}

function piadaCriadaPeloUsuario(idPiada) {
    const piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];
    return piadasSalvas.some(piada => piada.id === idPiada);
}

function criarCartaoPiada(piada) {
    const cartao = document.createElement('div');
    cartao.classList.add('cartao');
    cartao.setAttribute('data-id', piada.id);

    const conteudoPiada = document.createElement('p');
    conteudoPiada.textContent = `${piada.setup} ${piada.punchline}`;

    const botoesContainer = document.createElement('div');

    const btnExcluir = document.createElement('button');
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', () => excluirPiada(piada.id));

    botoesContainer.appendChild(btnExcluir);

    if (piadaCriadaPeloUsuario(piada.id)) {
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.addEventListener('click', () => editarPiadaSalva(piada.id)); 
        botoesContainer.appendChild(btnEditar);
    }

    cartao.appendChild(conteudoPiada);
    cartao.appendChild(botoesContainer);

    return cartao;
}


function excluirPiada(idPiada) {
    let piadasSalvas = JSON.parse(localStorage.getItem('piadas')) || [];
    piadasSalvas = piadasSalvas.filter(piada => piada.id !== idPiada);
    localStorage.setItem('piadas', JSON.stringify(piadasSalvas));

    const cartaoParaExcluir = document.querySelector(`.cartao[data-id="${idPiada}"]`);
    if (cartaoParaExcluir) {
        cartaoParaExcluir.remove();
    }
}

