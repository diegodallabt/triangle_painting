let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let selecionarTriangulo = document.getElementById('selecionarTriangulo');
let corVertice = document.getElementById('corVertice');
let excluirTrianguloBtn = document.getElementById('excluirTriangulo');
let corArestas = document.getElementById('corArestas');
let limparTela = document.getElementById('limparTela');

let triangulo = null;
let triangulos = [];
let bufferCanvas = document.createElement('canvas');
bufferCanvas.width = canvas.width;
bufferCanvas.height = canvas.height;
let bufferCtx = bufferCanvas.getContext('2d');

// Refresh na lista de triângulos para obter as novas instâncias
function atualizarListaTriangulos() {
    selecionarTriangulo.innerHTML = '';

    for (let i = 0; i < triangulos.length; i++) {
        let option = document.createElement('option');
        option.text = 'Triângulo ' + (i + 1);
        option.value = i;
        selecionarTriangulo.add(option);
    }
}

// Exclui triângulo selecionado da lista
excluirTrianguloBtn.addEventListener('click', function() {
    if (selecionarTriangulo.value !== '') {
        triangulos.splice(selecionarTriangulo.value, 1);

        corVertice.value = '';

        redrawAll();

        selecionarTriangulo.remove(selecionarTriangulo.selectedIndex);
        
        selecionarVertice.innerHTML = '';

        atualizarListaTriangulos();
    }
});

// Limpa o canvas
limparTela.addEventListener('click', function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);

    triangulos = [];

    selecionarVertice.innerHTML = '';

    corVertice.value = '';

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

// Gera ângulos de rotação para o triângulo
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
        {x: triangulo.x, y: triangulo.y, cor: {r: 0, g: 0, b: 0}},
        {x: triangulo.x + dist * Math.cos(angulo), y: triangulo.y + dist * Math.sin(angulo), cor: {r: 0, g: 0, b: 0}},
        {x: triangulo.x + dist * Math.cos(angulo + Math.PI / 2), y: triangulo.y + dist * Math.sin(angulo + Math.PI / 2), cor: {r: 0, g: 0, b: 0}}
    ];

    // Redesenha a partir do buffer e adiciona o triângulo em andamento
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bufferCanvas, 0, 0);
    desenharTriangulo(triangulo, 'Triângulo ' + (triangulos.length + 1), ctx);
});

// Cria o triângulo
canvas.addEventListener('mouseup', function(event) {
    if (!triangulo) return;

    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    // Calcula a distância entre a posição inicial do mouse e a posição atual do mouse
    let dx = x - triangulo.x;
    let dy = y - triangulo.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    triangulo.largura = dist;
    triangulo.altura = dist;

    triangulos.push(triangulo);

    let option = document.createElement('option');
    option.text = 'Triângulo ' + triangulos.length;
    option.value = triangulos.length - 1;
    selecionarTriangulo.add(option);

    redrawAll();

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

selecionarVertice.addEventListener('click', function() {
    if (selecionarTriangulo.value !== '' && selecionarVertice.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        let v = t.vertices[selecionarVertice.value];
        corVertice.value = rgbToHex(v.cor.r, v.cor.g, v.cor.b);

        // Redesenha a partir do buffer
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bufferCanvas, 0, 0);

        let currentFillStyle = ctx.fillStyle;

        ctx.beginPath();
        ctx.arc(v.x, v.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(${v.cor.r}, ${v.cor.g}, ${v.cor.b})`;
        ctx.fill();

        ctx.fillStyle = currentFillStyle;
    }
});

// Muda a cor do vértice
corVertice.addEventListener('input', function() {
    if (selecionarTriangulo.value !== '' && selecionarVertice.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        let v = t.vertices[selecionarVertice.value];
        let novaCor = hexParaRgb(corVertice.value);
        v.cor = novaCor;

        redrawAll();
    }
});

// Muda a cor das arestas
corArestas.addEventListener('input', function() {
    if (selecionarTriangulo.value !== '') {
        let t = triangulos[selecionarTriangulo.value];
        t.corArestas = corArestas.value;

        redrawAll();
    }
});

// Desenha os triângulos do buffer no canvas principal
function redrawAll() {
    bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
    for (let t of triangulos) {
        desenharTriangulo(t, null, bufferCtx);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bufferCanvas, 0, 0);
}

// Desenha os triângulos
function desenharTriangulo(t, rotulo, context) {
    if (t.vertices.every(v => v.cor && (v.cor.r !== 0 || v.cor.g !== 0 || v.cor.b !== 0))) {
        pintarTriangulo(t, context);
    }

    // Desenha as arestas
    context.beginPath();
    context.moveTo(t.vertices[0].x, t.vertices[0].y);
    context.lineTo(t.vertices[1].x, t.vertices[1].y);
    context.lineTo(t.vertices[2].x, t.vertices[2].y);
    context.closePath();
    context.strokeStyle = t.corArestas || 'black';
    context.lineWidth = 4;
    context.stroke();

    // Desenha os vértices
    for (let v of t.vertices) {
        let currentFillStyle = context.fillStyle;

        context.beginPath();
        context.arc(v.x, v.y, 5, 0, 2 * Math.PI);
        context.fillStyle = `rgb(${v.cor.r}, ${v.cor.g}, ${v.cor.b})`;
        context.fill();

        context.fillStyle = currentFillStyle;
    }

    // Desenha o rótulo
    context.fillStyle = 'black';
    context.font = '12px Arial';
    if (rotulo) {
        context.fillText(rotulo, t.x, t.y - 10);
    } else {
        let index = triangulos.indexOf(t);
        if (index !== -1) {
            context.fillText('Triângulo ' + (index + 1), t.x, t.y - 10);
        }
    }
}

// Funções auxiliares para conversão de cores
function hexParaRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Define a lista de scanlines e suas interseções
function addScanline(triangle) {
    const minY = Math.min(triangle.vertices[0].y, triangle.vertices[1].y, triangle.vertices[2].y);
    const maxY = Math.max(triangle.vertices[0].y, triangle.vertices[1].y, triangle.vertices[2].y);
    triangle.minY = minY;
    triangle.maxY = maxY;

    triangle.intersections = new Map();

    for (let c = minY; c < maxY; c++) {
        triangle.intersections.set(c, []);
    }

    criaIntersecao(triangle, 0, 1);
    criaIntersecao(triangle, 1, 2);
    criaIntersecao(triangle, 2, 0);

    // Ordena as interseções de acordo com a coordenada x
    triangle.intersections.forEach((xArray) => {
        if (xArray[0].x > xArray[1].x) {
            let temp = xArray[0];
            xArray[0] = xArray[1];
            xArray[1] = temp;
        }
        xArray[0].x = Math.ceil(xArray[0].x);
        xArray[1].x = Math.floor(xArray[1].x);
    });
}

// Cria as interseções para as scanlines
function criaIntersecao(triangle, v0, v1) {
    // Cálculo da taxa de variação para x e cores
    const variation = (triangle.vertices[v1].x - triangle.vertices[v0].x) / (triangle.vertices[v1].y - triangle.vertices[v0].y);
    const variationR = (triangle.vertices[v1].cor.r - triangle.vertices[v0].cor.r) / (triangle.vertices[v1].y - triangle.vertices[v0].y);
    const variationG = (triangle.vertices[v1].cor.g - triangle.vertices[v0].cor.g) / (triangle.vertices[v1].y - triangle.vertices[v0].y);
    const variationB = (triangle.vertices[v1].cor.b - triangle.vertices[v0].cor.b) / (triangle.vertices[v1].y - triangle.vertices[v0].y);

    let initialY, endY, currentX, currentR, currentG, currentB;

    if (triangle.vertices[v0].y < triangle.vertices[v1].y) {
        initialY = triangle.vertices[v0].y;
        endY = triangle.vertices[v1].y;
        currentX = triangle.vertices[v0].x;

        currentR = triangle.vertices[v0].cor.r;
        currentG = triangle.vertices[v0].cor.g;
        currentB = triangle.vertices[v0].cor.b;
    } else {
        initialY = triangle.vertices[v1].y;
        endY = triangle.vertices[v0].y;
        currentX = triangle.vertices[v1].x;

        currentR = triangle.vertices[v1].cor.r;
        currentG = triangle.vertices[v1].cor.g;
        currentB = triangle.vertices[v1].cor.b;
    }

    for (let currentY = initialY; currentY < endY; currentY++) {
        if (!triangle.intersections.has(currentY)) {
            triangle.intersections.set(currentY, []);
        }
        triangle.intersections.get(currentY).push({ x: currentX, r: currentR, g: currentG, b: currentB });

        currentX += variation;
        currentR += variationR;
        currentG += variationG;
        currentB += variationB;
    }
}

// Pinta o triângulo
function preencheTriangulo(triangle, context) {
    const initialY = triangle.minY;
    const endY = triangle.maxY;
    const intersections = triangle.intersections;

    for (let currentY = initialY; currentY < endY; currentY++) {
        const currentEdge = intersections.get(currentY);

        let k = 0;
        let firstX = currentEdge[k].x;
        let endX = currentEdge[k + 1].x;

        let currentR = currentEdge[k].r;
        let currentG = currentEdge[k].g;
        let currentB = currentEdge[k].b;

        const variationR = (currentEdge[k + 1].r - currentEdge[k].r) / (endX - firstX);
        const variationG = (currentEdge[k + 1].g - currentEdge[k].g) / (endX - firstX);
        const variationB = (currentEdge[k + 1].b - currentEdge[k].b) / (endX - firstX);

        for (let currentX = firstX; currentX < endX; currentX++) {
            context.fillStyle = `rgb(${Math.round(currentR)}, ${Math.round(currentG)}, ${Math.round(currentB)})`;
            context.fillRect(currentX, currentY, 1, 1);

            currentR += variationR;
            currentG += variationG;
            currentB += variationB;
        }
    }
}

function pintarTriangulo(triangulo, context) {
    addScanline(triangulo);
    preencheTriangulo(triangulo, context);
}

// Funções auxiliares para conversão de cores do seletor
function corAuxiliar(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + corAuxiliar(r) + corAuxiliar(g) + corAuxiliar(b);
}
