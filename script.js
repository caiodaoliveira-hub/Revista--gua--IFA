const botaoMenu = document.querySelector('.menu-botao');
const menu = document.querySelector('.menu');
const linksMenu = document.querySelectorAll('.menu a');
const secoes = document.querySelectorAll('.componente');
const elementosRevelar = document.querySelectorAll('.revelar');
const visualizador = document.querySelector('.visualizador');
const fecharVisualizador = document.querySelector('.fechar');

function alternarMenu() {
  const aberto = menu.classList.toggle('aberto');
  botaoMenu.classList.toggle('ativo', aberto);
  botaoMenu.setAttribute('aria-expanded', aberto);
  botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  document.body.classList.toggle('menu-aberto', aberto);
}

function fecharMenu() {
  menu.classList.remove('aberto');
  botaoMenu.classList.remove('ativo');
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu');
  document.body.classList.remove('menu-aberto');
}

botaoMenu.addEventListener('click', alternarMenu);
linksMenu.forEach(link => link.addEventListener('click', fecharMenu));

const observadorAnimacao = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visivel');
      observadorAnimacao.unobserve(entrada.target);
    }
  });
}, { threshold: 0.12 });

elementosRevelar.forEach(elemento => observadorAnimacao.observe(elemento));

const observadorSecoes = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (!entrada.isIntersecting) return;
    linksMenu.forEach(link => {
      link.classList.toggle('ativo', link.getAttribute('href') === `#${entrada.target.id}`);
    });
  });
}, { rootMargin: '-35% 0px -55% 0px' });

secoes.forEach(secao => observadorSecoes.observe(secao));

document.querySelectorAll('.foto-botao').forEach(botao => {
  botao.addEventListener('click', () => {
    const imagem = botao.querySelector('img');
    if (!imagem) {
      const seletorArquivo = document.createElement('input');
      seletorArquivo.type = 'file';
      seletorArquivo.accept = 'image/*';
      seletorArquivo.addEventListener('change', () => {
        const arquivo = seletorArquivo.files[0];
        if (!arquivo) return;

        const novaImagem = document.createElement('img');
        novaImagem.src = URL.createObjectURL(arquivo);
        novaImagem.alt = arquivo.name;
        botao.replaceChildren(novaImagem);
        botao.click();
      }, { once: true });
      seletorArquivo.click();
      return;
    }

    visualizador.querySelector('img').src = imagem.src;
    visualizador.querySelector('img').alt = imagem.alt;
    visualizador.querySelector('p').textContent = botao.closest('figure').querySelector('figcaption').textContent;
    visualizador.showModal();
  });
});

fecharVisualizador.addEventListener('click', () => visualizador.close());
visualizador.addEventListener('click', evento => {
  if (evento.target === visualizador) visualizador.close();
});

document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && menu.classList.contains('aberto')) fecharMenu();
});
