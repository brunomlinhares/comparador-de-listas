// Seletores DOM
const SELETORES = {
    BOTOES: {
        SEPARADORES: '.separator-btn',
        SEPARADORES_POR_TIPO: (tipo) => `.separator-btn[data-type="${tipo}"]`,
        TEMA: '.theme-toggle',
        COPIAR: '.resultado button',
        OPERACOES: '.buttons button'
    },
    CONTAINERS: {
        RESULTADO: '.resultado',
        RESULTADO_CONTEUDO: '#resultado',
        PILLS: '.pill'
    }
};

class GerenciadorTema {
    constructor() {
        this.temaAtual = localStorage.getItem('tema') || this.obterTemaPreferidoSistema();
        this.botaoTema = document.querySelector(SELETORES.BOTOES.TEMA);
        this.inicializar();
    }

    inicializar() {
        this.aplicarTema(this.temaAtual);
        this.configurarEventosMudancaTema();
    }

    obterTemaPreferidoSistema() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro';
    }

    alternar() {
        const novoTema = this.temaAtual === 'claro' ? 'escuro' : 'claro';
        this.aplicarTema(novoTema);
    }

    aplicarTema(tema) {
        this.temaAtual = tema;
        document.documentElement.setAttribute('data-theme', tema === 'escuro' ? 'dark' : 'light');
        localStorage.setItem('tema', tema);
        this.atualizarIcone();
    }

    atualizarIcone() {
        const icone = document.getElementById('theme-icon');
        const caminhoIcone = this.temaAtual === 'escuro' 
            ? '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" fill="currentColor"/>'
            : '<path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>';
        icone.innerHTML = caminhoIcone;
    }

    configurarEventosMudancaTema() {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('tema')) {
                this.aplicarTema(e.matches ? 'escuro' : 'claro');
            }
        });
    }
}

class GerenciadorCor {
    constructor() {
        this.colorPicker = document.getElementById('colorPicker');
        this.corPadrao = '#6366f1';
        this.corAtual = localStorage.getItem('corPrincipal') || this.corPadrao;
        this.inicializar();
    }

    inicializar() {
        this.aplicarCor(this.corAtual);
        this.configurarEventos();
    }

    aplicarCor(cor) {
        this.corAtual = cor;
        document.documentElement.style.setProperty('--primary-color', cor);
        document.documentElement.style.setProperty('--primary-hover', this.ajustarCor(cor, -10));
        this.colorPicker.value = cor;
        localStorage.setItem('corPrincipal', cor);
    }

    ajustarCor(cor, percentual) {
        const hex = cor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const ajuste = (valor) => {
            const novoValor = valor * (1 + percentual/100);
            return Math.min(255, Math.max(0, Math.round(novoValor)));
        };
        
        return `#${ajuste(r).toString(16).padStart(2, '0')}${ajuste(g).toString(16).padStart(2, '0')}${ajuste(b).toString(16).padStart(2, '0')}`;
    }

    configurarEventos() {
        this.colorPicker.addEventListener('change', (e) => {
            this.aplicarCor(e.target.value);
        });
    }
}

class GerenciadorSeparadores {
    constructor() {
        this.separadorEntrada = '\\n';
        this.separadorSaida = '\\n';
        this.botoesSeparadores = document.querySelectorAll(SELETORES.BOTOES.SEPARADORES);
        this.inicializar();
    }

    inicializar() {
        this.botoesSeparadores.forEach(botao => {
            botao.addEventListener('click', () => this.alterarSeparador(botao));
        });
    }

    alterarSeparador(botao) {
        const tipo = botao.dataset.type;
        const valor = botao.dataset.value;
        
        const botoesDoMesmoTipo = document.querySelectorAll(SELETORES.BOTOES.SEPARADORES_POR_TIPO(tipo));
        botoesDoMesmoTipo.forEach(b => b.classList.remove('active'));
        
        botao.classList.add('active');
        
        if (tipo === 'entrada') {
            this.separadorEntrada = valor;
        } else {
            this.separadorSaida = valor;
        }
    }

    obterSeparadorEntrada() {
        return this.separadorEntrada === '\\n' ? '\n' : this.separadorEntrada;
    }

    obterSeparadorSaida() {
        return this.separadorSaida === '\\n' ? '\n' : this.separadorSaida;
    }
}

class ComparadorListas {
    constructor(gerenciadorSeparadores) {
        this.gerenciadorSeparadores = gerenciadorSeparadores;
        this.containerResultado = document.querySelector(SELETORES.CONTAINERS.RESULTADO);
        this.conteudoResultado = document.getElementById('resultado');
        this.botaoCopiar = this.containerResultado.querySelector(SELETORES.BOTOES.COPIAR);
        
        // Adicionar método para gerar amostra
        this.gerarAmostra = () => {
            const gerarNumerosAleatorios = (quantidade) => {
                return Array.from({ length: quantidade }, () => 
                    Math.floor(Math.random() * 1000) + 1
                ).sort((a, b) => a - b);
            };

            const lista1 = document.getElementById('lista1');
            const lista2 = document.getElementById('lista2');

            lista1.value = gerarNumerosAleatorios(300).join('\n');
            lista2.value = gerarNumerosAleatorios(300).join('\n');

            this.atualizarContadores();
        };
    }

    obterListaDoElemento(id) {
        return new Set(document.getElementById(id).value
            .split(this.gerenciadorSeparadores.obterSeparadorEntrada())
            .map(item => item.trim())
            .filter(item => item.length > 0));
    }

    compararListas(operacao) {
        const lista1 = this.obterListaDoElemento('lista1');
        const lista2 = this.obterListaDoElemento('lista2');
        const resultado = this.executarOperacao(operacao, lista1, lista2);
        this.exibirResultado(resultado);
    }

    executarOperacao(operacao, lista1, lista2) {
        const operacoes = {
            'uniao': () => new Set([...lista1, ...lista2]),
            'intersecao': () => new Set([...lista1].filter(x => lista2.has(x))),
            'diferenca1': () => new Set([...lista1].filter(x => !lista2.has(x))),
            'diferenca2': () => new Set([...lista2].filter(x => !lista1.has(x)))
        };
        return operacoes[operacao]();
    }

    exibirResultado(resultado) {
        this.containerResultado.style.display = 'block';

        if (resultado.size === 0) {
            this.exibirSemResultado();
            return;
        }

        this.exibirComResultado(resultado);
    }

    exibirSemResultado() {
        this.conteudoResultado.innerHTML = '<div class="sem-resultado">Nenhum resultado encontrado</div>';
        this.botaoCopiar.style.display = 'none';
        document.getElementById('contadorResultado').textContent = 'Itens: 0';
    }

    exibirComResultado(resultado) {
        const pills = Array.from(resultado)
            .map(item => `<div class="pill">${item}</div>`)
            .join('');
        
        this.conteudoResultado.innerHTML = `<div class="resultado-pills">${pills}</div>`;
        this.botaoCopiar.style.display = 'flex';
        document.getElementById('contadorResultado').textContent = `Itens: ${resultado.size}`;
    }

    copiarResultado() {
        const elementosPills = document.querySelectorAll(SELETORES.CONTAINERS.PILLS);
        const resultado = Array.from(elementosPills)
            .map(pill => pill.textContent.trim())
            .join(this.gerenciadorSeparadores.obterSeparadorSaida());
        
        if (!resultado) {
            alert('Não há resultado para copiar!');
            return;
        }
        
        navigator.clipboard.writeText(resultado)
            .then(() => alert('Resultado copiado para a área de transferência!'));
    }

    calcularEstatisticas(id) {
        const texto = document.getElementById(id).value;
        const itens = texto.split(this.gerenciadorSeparadores.obterSeparadorEntrada())
            .map(item => item.trim())
            .filter(item => item.length > 0);
        
        const itensUnicos = new Set(itens);
        
        // Verifica se todos os itens são números
        const numeros = itens.map(item => parseFloat(item))
            .filter(num => !isNaN(num));
        const todosNumeros = numeros.length === itens.length && itens.length > 0;
        
        // Calcula soma e média se forem números
        const soma = todosNumeros ? numeros.reduce((a, b) => a + b, 0) : null;
        const media = todosNumeros ? soma / numeros.length : null;
        
        // Atualiza o painel de estatísticas
        const estatisticas = document.getElementById(`estatisticas${id.slice(-1)}`);
        
        // Atualiza todos os cards de estatísticas
        const cards = estatisticas.querySelectorAll('.estat-card');
        cards[0].querySelector('span').textContent = itens.length;
        cards[1].querySelector('span').textContent = itensUnicos.size;
        cards[2].querySelector('span').textContent = todosNumeros ? soma.toLocaleString('pt-BR') : '-';
        cards[3].querySelector('span').textContent = todosNumeros ? media.toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : '-';
    }

    atualizarContadores() {
        const calcularQuantidadeItens = (id) => {
            const texto = document.getElementById(id).value;
            return texto.split(this.gerenciadorSeparadores.obterSeparadorEntrada())
                .map(item => item.trim())
                .filter(item => item.length > 0)
                .length;
        };

        const qtdLista1 = calcularQuantidadeItens('lista1');
        const qtdLista2 = calcularQuantidadeItens('lista2');
        
        // Atualizar os contadores diretos das listas
        document.querySelector('#estatisticas1 .estat-card:first-child span').textContent = qtdLista1;
        document.querySelector('#estatisticas2 .estat-card:first-child span').textContent = qtdLista2;
        
        // Calcular outras estatísticas
        this.calcularEstatisticas('lista1');
        this.calcularEstatisticas('lista2');
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const gerenciadorTema = new GerenciadorTema();
    const gerenciadorCor = new GerenciadorCor();
    const gerenciadorSeparadores = new GerenciadorSeparadores();
    const comparadorListas = new ComparadorListas(gerenciadorSeparadores);

    // Configurar eventos
    const botaoAlternarTema = document.querySelector(SELETORES.BOTOES.TEMA);
    botaoAlternarTema.addEventListener('click', () => gerenciadorTema.alternar());
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !window.getSelection().toString()) {
            e.preventDefault();
            comparadorListas.copiarResultado();
        }
    });

    // Configurar botões de operação
    const botoesOperacao = document.querySelectorAll(SELETORES.BOTOES.OPERACOES);
    botoesOperacao.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesOperacao.forEach(b => b.classList.remove('active'));
            botao.classList.add('active');
            const operacao = botao.getAttribute('onclick').match(/'(.+)'/)[1];
            comparadorListas.compararListas(operacao);
        });
    });

    // Adicionar evento para o botão de amostra
    document.getElementById('btnAmostra').addEventListener('click', () => {
        comparadorListas.gerarAmostra();
    });

    // Configurações iniciais
    const botaoCopiarResultado = document.querySelector(SELETORES.BOTOES.COPIAR);
    const containerResultado = document.querySelector(SELETORES.CONTAINERS.RESULTADO);
    botaoCopiarResultado.style.display = 'none';
    containerResultado.style.display = 'none';

    // Adicionar eventos para atualizar contadores quando o texto mudar
    ['lista1', 'lista2'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            comparadorListas.atualizarContadores();
        });
    });

    // Inicializar contadores
    comparadorListas.atualizarContadores();
});
