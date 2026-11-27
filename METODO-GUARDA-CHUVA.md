# O método do guarda-chuva

**Regra para todos os apps da DBGIANINI** (começou no 7entidos, em 27/11/2026).

A ideia em uma frase: **o app aprende um pouco em cada fase, junta tudo numa ficha só, confere com a própria pessoa e só então sugere alguma coisa.**

---

## 1. Uma ficha única, por trás

- Cada pessoa tem **uma ficha só**. Ela é a inteligência do app.
- **A pessoa nunca vê a ficha.** Ela só vê o progresso (ver item 8).
- A ficha tem um **número de versão**, para poder crescer depois sem perder o que já foi guardado.

## 2. Uma gaveta para cada fase

- A ficha é dividida em **gavetas**: uma para cada fase do app.
- Duas gavetas são de todas as fases:
  - **Os "nãos"**: tudo o que a pessoa recusou.
  - **Correções**: tudo o que ela corrigiu.
- As gavetas das fases que ainda não existem já nascem prontas, vazias.

## 3. Cada fase escreve na sua gaveta e lê as anteriores

- **Escreve** só na própria gaveta. Nunca mexe na gaveta de outra fase.
- **Lê** todas as gavetas das fases que vieram antes. É assim que cada fase começa sabendo o que as outras aprenderam.
- As primeiras fases podem testar coisas novas, para o app aprender mais.

## 4. Cada anotação é uma pista, em peças

Cada pista guarda:

- **o resumo em peças**: quem, onde, quando, quais sentidos (ou áreas), qual motivo;
- **a força** (forte, média ou fraca);
- **de que fase veio** e **a data**.

Nunca o nome da pessoa. Nunca o texto que ela escreveu, do jeito que escreveu.

## 5. Três forças

| A pessoa… | A pista fica… |
|---|---|
| escolheu uma vez | **média** |
| escolheu de novo, em outra fase | **forte** |
| mudou de ideia (ou o app percebeu que a resposta mudou) | **fraca** |

## 6. A correção da pessoa sempre vence

- O que ela corrige entra **forte**. O palpite antigo vira **fraco** e fica anotado na gaveta Correções.
- Quando ela diz "não" a um palpite, o app pergunta **"Então o que é?"**. A resposta dela já entra forte.

## 7. O "não" nunca vira sugestão

- "Nenhuma dessas", novidade recusada e sugestão recusada vão para a gaveta **Os "nãos"**.
- Um "não" **nunca** volta como sugestão. Ele pode, no máximo, ajudar a entender o que a pessoa não gosta.

## 8. Antes de sugerir, conferir com a pessoa

- Existe uma fase só para **validar**: o app mostra o que percebeu e a pessoa confirma ou nega.
  - Confirmou: vira **forte**.
  - Negou: **sai** da ficha (e vai para os "nãos").
- **Só pista forte vira sugestão.**
- Depois das sugestões, o app continua aprendendo: sugestão aceita volta como pista; recusada vai para os "nãos".

## 9. Privacidade

- O que a pessoa **escreve ou fala** fica **só no celular dela**, separado da ficha. Ela pode apagar na hora ("Apagar") ou depois, numa tela "O que eu escrevi".
- Para a ficha, para o servidor e para a inteligência do app vai **só o resumo em peças**. Nunca o nome, o e-mail ou o telefone.
- Cópia da ficha no servidor (para quem faz login): só liga depois que existir login **e** a revisão de privacidade (LGPD) estiver feita. Até lá, fica pronta e desligada.

## 10. O que a pessoa vê: um progresso que cresce e nunca murcha

- No lugar da ficha, a pessoa vê **um elemento que cresce** (no 7entidos, uma plantinha).
- Ele **sobe** a cada fase, ganha um sinal pequeno no meio da fase e faz uma festa no fim (luz, som, vibração e uma frase curta).
- **Nunca murcha e nunca desce**: nem quando a pessoa recomeça uma fase, nem quando fica dias sem entrar.
- Sem pontos e sem competição.
- Quando a pessoa recomeça uma fase, ela vê a fase zerada. Por trás, as respostas antigas ficam na ficha como pista fraca.

## 11. O resumo do fim de cada fase

- Mostra **só o que a pessoa escolheu**, tirado da ficha, sem interpretar.
- Vem com uma frase curta: é uma primeira visão, ainda em construção; quanto mais ela preencher, mais o app surpreende.
- Nunca mostra forças, gavetas ou qualquer coisa da ficha.

---

### Como usar num app novo (lista rápida)

1. Liste as fases do app e crie uma gaveta para cada uma, mais "Os nãos" e "Correções".
2. Defina quais são as **peças** do resumo daquele app (no 7entidos: quem, onde, quando, sentidos, motivo).
3. Em cada fase: ler as gavetas anteriores, escrever só na sua.
4. Marque as forças (média, forte, fraca) e deixe a correção da pessoa sempre vencer.
5. Faça uma fase de validação antes de sugerir. Sugira só com pistas fortes.
6. Guarde o que a pessoa escreve só no aparelho dela, com botão de apagar.
7. Mostre o progresso com algo que cresce e nunca murcha.

*No 7entidos, o código está em `app/ficha.js` (a ficha) e `app/planta.js` (a plantinha).*
