// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let jogoAtivo = true;

// Carregando a imagem do jogador
const imgJogador = new Image();
imgJogador.src = '../assets/player.png';

// Propriedades do jogador
const jogador = {
    x: 50,
    y: 500,
    width: 50,
    height: 50,
    velocidadeX: 0,
    velocidadeY: 0,
    gravidade: 1,
    pulando: false
};

// Plataformas
const plataformas = [
    { x: 0, y: 550, width: 800, height: 50 },
    { x: 200, y: 450, width: 100, height: 20 },
    { x: 400, y: 350, width: 100, height: 20 },
    { x: 600, y: 250, width: 100, height: 20 }
];

// Detectando entrada do teclado
const teclas = {};

document.addEventListener('keydown', (e) => {
    teclas[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    teclas[e.code] = false;
});

// Função para atualizar o estado do jogador
function atualizarJogador() {
    // Movimentação horizontal
    if (teclas['ArrowLeft'] || teclas['KeyA']) {
        jogador.velocidadeX = -5;
    } else if (teclas['ArrowRight'] || teclas['KeyD']) {
        jogador.velocidadeX = 5;
    } else {
        jogador.velocidadeX = 0;
    }

    // Pular
    if ((teclas['ArrowUp'] || teclas['KeyW'] || teclas['Space']) && !jogador.pulando) {
        jogador.velocidadeY = -20;
        jogador.pulando = true;
        // Inserir áudio de pulo aqui
    }

    // Aplicar gravidade
    jogador.velocidadeY += jogador.gravidade;
    jogador.x += jogador.velocidadeX;
    jogador.y += jogador.velocidadeY;

    // Verificar colisão com plataformas
    plataformas.forEach(plataforma => {
        if (
            jogador.x < plataforma.x + plataforma.width &&
            jogador.x + jogador.width > plataforma.x &&
            jogador.y + jogador.height < plataforma.y + plataforma.height &&
            jogador.y + jogador.height + jogador.velocidadeY >= plataforma.y
        ) {
            jogador.y = plataforma.y - jogador.height;
            jogador.velocidadeY = 0;
            jogador.pulando = false;
        }
    });

    // Limitar o jogador dentro do canvas
    if (jogador.x < 0) jogador.x = 0;
    if (jogador.x + jogador.width > canvas.width) jogador.x = canvas.width - jogador.width;
    if (jogador.y + jogador.height > canvas.height) {
        jogador.y = canvas.height - jogador.height;
        jogador.velocidadeY = 0;
        jogador.pulando = false;
    }
}

// Função para desenhar o jogador
function desenharJogador() {
    ctx.drawImage(imgJogador, jogador.x, jogador.y, jogador.width, jogador.height);
}

// Função para desenhar plataformas
function desenharPlataformas() {
    ctx.fillStyle = '#654321'; // Cor marrom para plataformas
    plataformas.forEach(plataforma => {
        ctx.fillRect(plataforma.x, plataforma.y, plataforma.width, plataforma.height);
    });
}

// Função principal do jogo
function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharPlataformas();
    desenharJogador();

    atualizarJogador();

    if (jogoAtivo) {
        requestAnimationFrame(desenhar);
    }
}

// Inicia o jogo quando a imagem do jogador é carregada
imgJogador.onload = desenhar;
