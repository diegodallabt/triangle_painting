let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let selecionarTriangulo = document.getElementById('selecionarTriangulo');
let corVertice = document.getElementById('corVertice');
let excluirTrianguloBtn = document.getElementById('excluirTriangulo');
let corArestas = document.getElementById('corArestas');
let limparTela = document.getElementById('limparTela');

let triangulo = null;
let triangulos = [];

// Dá um refresh na lista de triângulos para obter as novas instâncias
function atualizarListaTriangulos() {
    selecionarTriangulo.innerHTML = '';

    // Adiciona novas opções com base na lista de triângulos
    for (let i = 0; i < triangulos.length; i++) {
        let option = document.createElement('option');
        option.text = 'Triângulo ' + (i + 1);
        option.value = i;
        selecionarTriangulo.add(option);
    }
}

// Remove o triângulo selecionado da lista
excluirTrianguloBtn.addEventListener('click', function() {
    if (selecionarTriangulo.value !== '') {
        // Remove o triângulo selecionado da lista
        triangulos.splice(selecionarTriangulo.value, 1);

        corVertice.value = '';

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let t of triangulos) {
            desenharTriangulo(t);
        }

        // Remove o triângulo selecionado da lista de opções
        selecionarTriangulo.remove(selecionarTriangulo.selectedIndex);

        // Limpa a lista de vértices
        selecionarVertice.innerHTML = '';
        

        atualizarListaTriangulos();
    }
});

// Limpar a tela de desenho
limparTela.addEventListener('click', function() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Limpa a lista de triângulos
    triangulos = [];

    // Limpa a lista de vértices
    selecionarVertice.innerHTML = '';

    // Limpa o input de cor
    corVertice.value = '';

    // Limpa o input de cor das arestas
    corArestas.value = '';
    
    atualizarListaTriangulos();
});

// Criação do triângulo clicando na tela
canvas.addEventListener('mousedown', function(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    triangulo = {x: x, y: y, largura: 0, altura: 0, vertices: []};
});

// Define a forma do triângulo c/ rotação de acordo com a movimentação do mouse
canvas.addEventListener('mousemove', function(event) {
    if (!triangulo) return;

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Calcula a distância entre a posição inicial do mouse e a posição atual do mouse
    let dx = x - triangulo.x;
    let dy = y - triangulo.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    // Calcula o ângulo entre a posição inicial do mouse e a posição atual do mouse (para fazer a rotação)
    let angulo = Math.atan2(dy, dx);

    // Calcula as posições dos vértices do triângulo
    triangulo.vertices = [
        {x: triangulo.x, y: triangulo.y, cor: null},
        {x: triangulo.x + dist * Math.cos(angulo), y: triangulo.y + dist * Math.sin(angulo), cor: null},
        {x: triangulo.x + dist * Math.cos(angulo + Math.PI / 2), y: triangulo.y + dist * Math.sin(angulo + Math.PI / 2), cor: null}
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let t of triangulos) {
        desenharTriangulo(t);
    }
    desenharTriangulo(triangulo, 'Triângulo ' + (triangulos.length + 1));
});

// Adiciona o triângulo criado ao soltar o mouse à lista de triângulos com seu respectivo rótulo
canvas.addEventListener('mouseup', function(event) {
    if (!triangulo) return;

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Calcula a distância entre a posição inicial do mouse e a posição atual do mouse
    let dx = x - triangulo.x;
    let dy = y - triangulo.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    // Define a largura e a altura do triângulo
    triangulo.largura = dist;
    triangulo.altura = dist;

    triangulos.push(triangulo);
    
    let option = document.createElement('option');
    option.text = 'Triângulo ' + triangulos.length;
    option.value = triangulos.length - 1;
    selecionarTriangulo.add(option);

    triangulo = null;
});

// Cria a lista de vértices do triângulo
selecionarTriangulo.addEventListener('click', function() {
    selecionarVertice.innerHTML = '';
    if(selecionarTriangulo.value !== ''){
        let t = triangulos[selecionarTriangulo.value];
        for(let i=0; i<t.vertices.length; i++){
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = 'Vértice ' + (i + 1);
            selecionarVertice.appendChild(opt);
        }
    }

});

// Adiciona os vértices ao triângulo
selecionarVertice.addEventListener('click', function() {
    corVertice.value = '';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let t of triangulos) {
        desenharTriangulo(t);
    }

    // Se um triângulo e um vértice foram selecionados, desenha um círculo na cor especificada no vértice
    if (selecionarTriangulo.value !== '' && selecionarVertice.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        let v = t.vertices[selecionarVertice.value];

        let currentFillStyle = ctx.fillStyle;

        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI); 
        ctx.fillStyle = v.cor || 'black';
        ctx.fill();

        ctx.fillStyle = currentFillStyle;
    }
});

// Muda a cor do vértice
corVertice.addEventListener('input', function() {
    if (selecionarTriangulo.value !== '' && selecionarVertice.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        let v = t.vertices[selecionarVertice.value];
        v.cor = corVertice.value;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let t of triangulos) {
        desenharTriangulo(t);
    }
});

// Muda a cor das arestas
corArestas.addEventListener('input', function() {
    if (selecionarTriangulo.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        t.corArestas = corArestas.value;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let t of triangulos) {
        desenharTriangulo(t);
        pintarTriangulo(t);
    }
});

// Função principal de desenho do triângulo
function desenharTriangulo(t, rotulo) {
    // Desenha o triângulo
    ctx.beginPath();
    ctx.moveTo(t.vertices[0].x, t.vertices[0].y);
    ctx.lineTo(t.vertices[1].x, t.vertices[1].y);
    ctx.lineTo(t.vertices[2].x, t.vertices[2].y);
    ctx.closePath();
    ctx.strokeStyle = t.corArestas || 'black';
    ctx.stroke();

    // Desenha os vértices
    for (let v of t.vertices) {
        let currentFillStyle = ctx.fillStyle;

        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = v.cor || 'black';
        ctx.fill();

        ctx.fillStyle = currentFillStyle;
    }

    if(t.vertices.every(v => v.cor)){
        pintarTriangulo(t);
    }

    // Desenha o rótulo
    ctx.font = '12px Arial'; 
    if (rotulo) {
        ctx.fillText(rotulo, t.x, t.y - 10); 
    } else {
        let index = triangulos.indexOf(t);
        if (index !== -1) {
            ctx.fillText('Triângulo ' + (index + 1), t.x, t.y - 10);
        }
    }
}

// Função de pintura dos triângulos
function pintarTriangulo(t) {
    if (t.vertices.every(v => v.cor)) {
        let vertices = [...t.vertices].sort((a, b) => a.y - b.y);

        let cor1 = vertices[0].cor || 'black';
        let cor2 = vertices[1].cor || 'black';
        let cor3 = vertices[2].cor || 'black';

        let x1 = vertices[0].x;
        let x2 = vertices[0].x;

        let erro1 = 0;
        let erro2 = 0;

        // Pinta a primeira metade do triângulo
        for (let y = vertices[0].y; y < vertices[1].y; y++) {
            // Calcula a cor da linha atual
            let fatorCor = (y - vertices[0].y) / (vertices[1].y - vertices[0].y);
            let corLinha = calcularCorInterpolada(cor1, cor2, fatorCor);

            pintarLinha(Math.round(x1), Math.round(x2), y, corLinha);

            // Atualiza as posições x e os erros
            erro1 += Math.abs(vertices[1].x - vertices[0].x);
            erro2 += Math.abs(vertices[2].x - vertices[0].x);

            while (erro1 >= Math.abs(vertices[1].y - vertices[0].y)) {
                x1 += Math.sign(vertices[1].x - vertices[0].x);
                erro1 -= Math.abs(vertices[1].y - vertices[0].y);
            }

            while (erro2 >= Math.abs(vertices[2].y - vertices[0].y)) {
                x2 += Math.sign(vertices[2].x - vertices[0].x);
                erro2 -= Math.abs(vertices[2].y - vertices[0].y);
            }
        }

        // Reinicializa a posição x1 e o erro1
        x1 = vertices[1].x;
        erro1 = 0;

        // Pinta a segunda metade do triângulo
        for (let y = vertices[1].y; y <= vertices[2].y; y++) {
            // Calcula a cor da linha atual
            let fatorCor = (y - vertices[1].y) / (vertices[2].y - vertices[1].y);
            let corLinha = calcularCorInterpolada(cor2, cor3, fatorCor);

            pintarLinha(Math.round(x1), Math.round(x2), y, corLinha);

            // Atualiza as posições x e os erros
            erro1 += Math.abs(vertices[2].x - vertices[1].x);
            erro2 += Math.abs(vertices[2].x - vertices[0].x);

            while (erro1 >= Math.abs(vertices[2].y - vertices[1].y)) {
                x1 += Math.sign(vertices[2].x - vertices[1].x);
                erro1 -= Math.abs(vertices[2].y - vertices[1].y);
            }

            while (erro2 >= Math.abs(vertices[2].y - vertices[0].y)) {
                x2 += Math.sign(vertices[2].x - vertices[0].x);
                erro2 -= Math.abs(vertices[2].y - vertices[0].y);
            }
        }
    }
}

// Calcula a cor interpolada entre duas cores
function calcularCorInterpolada(cor1, cor2, fator) {
    let rgb1 = hexParaRgb(cor1);
    let rgb2 = hexParaRgb(cor2);

    let r = rgb1.r + fator * (rgb2.r - rgb1.r);
    let g = rgb1.g + fator * (rgb2.g - rgb1.g);
    let b = rgb1.b + fator * (rgb2.b - rgb1.b);

    return rgbParaHex(r, g, b);
}

// Pinta uma linha horizontal
function pintarLinha(x1, x2, y, cor) {
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.strokeStyle = cor;
    ctx.stroke();
}

// Funções auxiliares para converter entre os formatos hexadecimal e RGB
function hexParaRgb(hex) {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return {r: r, g: g, b: b};
}

function rgbParaHex(r, g, b) {
    r = Math.round(r).toString(16);
    g = Math.round(g).toString(16);
    b = Math.round(b).toString(16);
    return '#' + r.padStart(2, '0') + g.padStart(2, '0') + b.padStart(2, '0');
}