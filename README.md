# 7ENTIDOS · site oficial

Site do aplicativo 7ENTIDOS (em desenvolvimento). Domínio: 7entidos.com.br.

**Situação:** versão pública inicial (02/11/2026). Seções sem conteúdo final ficam escondidas.

## Onde fica cada coisa
- `index.html` · página principal (textos marcados com `<!-- TEXTO: ... -->`)
- `privacidade.html` · política de privacidade (MINUTA, não é documento final)
- O painel de revisão fica só na prévia privada do Claude, não neste site
- `js/conteudo.js` · fotos, telas do app, e-mail e Google Analytics (só com consentimento)
- `js/consentimento.js` · aviso "Podemos contar as visitas?" e carregamento do Analytics após o aceite
- `fotos/` · fotografias 10×10 aprovadas
- `telas/` · capturas reais do aplicativo, sem dados pessoais
- `assets/` · símbolo novo do 7ENTIDOS (`simbolo-7entidos-icone.svg`, `simbolo-7entidos-sem-fundo.svg`, ícones PNG). Aprovado pelo fundador em 02/11/2026. O antigo "Contando 7" fica guardado como histórico (`simbolo-contando-7.svg`).

## Regras
- Só fotos 10×10 fornecidas e autorizadas para publicação.
- Google Analytics (G-0GPWW3EZZF) só carrega depois do "Aceitar" no aviso de consentimento (`js/consentimento.js`). Nunca enviar conteúdo pessoal.
- Ao apontar o domínio no Registro.br, não alterar os registros de e-mail do Google (MX, SPF, DKIM, DMARC).

## App do piloto (`app/`)
- `app/index.html` · o app 7ENTIDOS em arquivo único (React 18 via CDN), publicado em 7entidos.com.br/app
- Os dados de cada pessoa ficam só no navegador dela (localStorage). Nada vai para servidor.
- O "Nosso combinado" (consentimento) aparece na primeira vez e tem link para `privacidade.html`.
- Google Analytics só liga se a pessoa marcar "estatísticas anônimas" no combinado, e só no domínio oficial. Eventos enviados: `app_aberto` e `tela` (nome da aba). Nunca respostas, lembranças, textos ou fotos.

## Identidade visual (02/11/2026)
- Noite profunda (`#111113`/`#161616`), amarelo `#FFD43B`, branco suave `#F4F4F4`, cinza `#C4C4C4`.
- Anel de sete luzes, uma cor por sentido: Sinais internos `#DA77F2`, Audição `#9B8CFF`, Visão `#4DABF7`, Movimento e posição do corpo `#6FD3C6`, Olfato `#69DB7C`, Tato `#F6B46A`, Paladar `#FF6B6B`.
- Títulos em Fraunces, textos em Manrope. Frase: "A vida é feita de boas sensações. No seu ritmo."
- As fotos `fotos/pessoa-sentindo-*.jpg` vêm dos estudos de campanha e são provisórias até haver fotos reais e diversas, com autorização.
