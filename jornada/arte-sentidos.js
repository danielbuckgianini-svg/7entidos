/* 7entidos · Arte das opções (Sala das Imagens, aprovada em 06/11/2026)
   - Noção do corpo: "Linha de luz" (traço dourado no azul-noite)
   - Os outros 6 sentidos: "Caderno do pintor", no estilo do pintor fixo do sentido no Museu
     (Visão Van Gogh · Audição Klimt · Tato Picasso · Olfato Frida Kahlo · Paladar Monet · Equilíbrio Dalí)
   Uso: window.ARTE7[idDoSentido][nomeDaOpcao] -> conteúdo SVG para um viewBox 0 0 300 300. */
(function(){
const C=(x,y,r)=>`M${x} ${y}m-${r} 0a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 -${2*r} 0`;
const E=(x,y,rx,ry)=>`M${x} ${y}m-${rx} 0a${rx} ${ry} 0 1 0 ${2*rx} 0a${rx} ${ry} 0 1 0 -${2*rx} 0`;
const NUVEM='M25 45C18 45 16 34 24 32C24 22 38 20 42 28C46 18 62 20 62 30C72 30 74 44 64 45Z';

const CORPO=[
 ['abraco','Abraço apertado',['M42 26m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0','M60 28m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0','M28 92C28 62 34 42 44 36','M74 92C74 62 68 44 58 38','M34 52C46 44 62 46 72 58','M68 50C56 60 42 60 30 64']],
 ['pescoco','Alongar o pescoço',['M58 30m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0','M52 40C50 46 48 50 46 56','M20 66C32 56 56 56 80 66','M70 18C78 24 80 32 76 40','M74 40l2 0l0-3']],
 ['espreguicar','Espreguiçar',['M50 26m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0','M50 34L50 66','M50 42C42 32 38 20 34 8','M50 42C58 32 62 20 66 8','M50 66L42 92','M50 66L58 92','M24 14l-6-4','M76 14l6-4']],
 ['chao','Deitar no chão',['M8 76L92 76','M20 66m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0','M26 68C44 66 62 66 84 68','M38 67L30 54','M46 67L50 54','M84 68L90 64','M30 20L50 60','M44 18L64 58','M58 16L78 56']],
 ['respirar','Respirar fundo',['M34 40m-11 0a11 11 0 1 0 22 0a11 11 0 1 0-22 0','M12 86C18 64 50 64 56 86','M48 40C56 34 62 44 70 38','M50 46C60 42 66 52 78 46','M48 52C56 50 62 58 70 56']],
 ['maos','Massagem nas mãos',['M50 64m-16 0a16 19 0 1 0 32 0a16 19 0 1 0-32 0','M38 50L34 28','M45 46L43 22','M53 46L55 22','M61 50L65 30','M65 64L78 56','M50 66m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0']],
 ['pes','Pés descalços na grama',['M42 80C36 70 36 50 42 40C48 32 58 34 60 44C62 56 60 70 64 80Z','M44 34m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0','M52 31m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0','M10 92L14 78','M18 92L22 80','M74 92L78 78','M84 92L86 80','M28 92L30 84','M66 92L68 84']],
 ['banho','Banho quente',['M24 14L58 14C66 14 72 20 72 28','M34 30L32 46','M44 30L43 50','M54 30L54 48','M64 30L65 46','M28 88C22 78 34 72 28 62','M48 90C42 80 54 74 48 64','M68 88C62 78 74 72 68 62']],
 ['rir','Rir até doer a barriga',['M50 30m-12 0a12 12 0 1 0 24 0a12 12 0 1 0-24 0','M43 28C45 26 47 26 48 28','M52 28C54 26 56 26 57 28','M43 34C47 40 53 40 57 34','M34 92C34 64 66 64 66 92','M40 76C46 72 54 72 60 76','M28 20l-8-4','M72 20l8-4','M26 32l-9 0','M74 32l9 0']],
 ['cochilo','Cochilo depois do almoço',['M12 72L88 72','M14 72L14 58C14 52 22 52 22 58L22 64L78 64L78 58C78 52 86 52 86 58L86 72','M30 56m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0','M36 58C50 56 62 56 74 58','M66 24L76 24L66 34L76 34','M80 12L86 12L80 18L86 18']],
 ['chuveiro','Cantar no chuveiro',['M22 10L50 10C56 10 60 14 60 20','M46 44m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0','M30 92C30 66 62 66 62 92','M56 56L62 50','M62 50m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0','M72 34L72 20L82 18L82 30','M70 34m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0','M80 30m-2.5 0a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0-5 0']],
 ['ponta','Ficar na ponta dos pés',['M48 8L50 54','M50 54C52 66 56 76 60 86L74 86','M50 54C44 60 42 64 44 70','M8 86L92 86','M30 70L30 50','M24 56L30 50L36 56']],
 ['bocejar','Bocejar e esticar',['M50 50m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0','M50 54m-3 0a3 4 0 1 0 6 0a3 4 0 1 0-6 0','M42 44C36 30 42 14 50 10C58 14 64 30 58 44','M32 92C32 68 68 68 68 92']],
 ['cafune','Cafuné',['M40 66m-13 0a13 13 0 1 0 26 0a13 13 0 1 0-26 0','M30 58C32 54 36 54 36 58','M38 54C40 50 44 50 44 54','M46 56C48 52 52 52 52 56','M58 30C66 34 68 44 62 52','M62 52L54 50','M62 52L56 56','M70 22C76 26 78 32 76 38']],
 ['sapato','Tirar o sapato no fim do dia',['M10 82L92 82','M14 70L40 70C50 70 56 62 64 62L76 62C82 62 82 72 76 74L16 76Z','M40 52L54 40C60 36 66 36 70 40L76 46C78 50 74 54 70 52L46 58Z','M84 34l4-6','M88 42l6-2']]
];

const OUTROS={
 aud:{pintor:'Klimt',ops:[
  ['chuva','Chuva',[NUVEM,'M30 56L27 66','M44 56L41 68','M58 56L55 66','M36 72L33 82','M52 74L49 84']],
  ['mar','Mar',['M8 50C20 40 30 60 42 50S64 40 76 50S92 60 96 50','M8 66C20 56 30 76 42 66S64 56 76 66S92 76 96 66','M8 82C20 72 30 92 42 82S64 72 76 82']],
  ['passaros','Pássaros',['M20 40C26 34 30 34 34 40C38 34 42 34 48 40','M52 28C56 24 60 24 62 28C64 24 68 24 72 28','M40 62C46 56 50 56 54 62C58 56 62 56 68 62','M10 86C40 80 70 82 92 76']],
  ['cafepass','Café passando',['M30 30L70 30L56 60L44 60Z','M38 66L62 66L64 88L36 88Z','M50 61L50 65','M44 22C40 16 48 12 44 6','M56 22C52 16 60 12 56 6']],
  ['panela','Panela no fogo',['M22 50L78 50L74 82L26 82Z','M16 50L84 50','M12 56L22 56','M78 56L88 56','M38 42C34 34 42 30 38 22','M50 42C46 34 54 30 50 22','M62 42C58 34 66 30 62 22']],
  ['grilos','Grilos à noite',['M70 14C60 16 56 30 64 38C56 40 46 32 48 20C50 12 62 8 70 14Z','M10 92L16 72','M22 92L24 76','M34 92L40 70','M52 80C56 74 66 74 70 80Z','M68 76L80 66','M56 76L48 66','M78 84C84 80 84 74 80 70']],
  ['sino','Sino de meditação',['M24 56C24 78 76 78 76 56Z','M20 56L80 56','M60 40L84 24','M30 40C40 30 60 30 70 40','M22 32C36 18 64 18 78 32']],
  ['gato','Gato ronronando',['M20 76C20 52 54 46 70 60C80 68 76 80 62 80L28 80C22 80 20 78 20 76Z','M66 52L68 42L74 48','M76 48L82 42L82 54','M24 76C14 70 18 60 26 64','M40 40C44 36 48 40 52 36','M44 30C48 26 52 30 56 26']],
  ['coracao','Coração',['M50 76C24 58 18 42 28 32C36 24 46 30 50 38C54 30 64 24 72 32C82 42 76 58 50 76Z','M8 90L34 90L40 82L46 96L52 90L92 90']],
  ['fogueira','Fogueira estalando',['M50 18C40 34 30 44 34 60C36 72 64 72 66 60C70 44 58 36 56 26C52 34 50 38 46 40C48 32 50 26 50 18Z','M24 82L76 72','M24 72L76 82','M30 28L32 24','M70 30L72 26','M64 16L66 12']],
  ['sininho','Sininho de vento na varanda',['M20 18L80 18','M30 18L30 50','M44 18L44 62','M58 18L58 56','M72 18L72 46','M30 50L30 66','M44 62L44 80','M58 56L58 74','M72 46L72 60','M10 88C30 82 50 94 70 88']],
  ['trovao','Trovão ao longe',[NUVEM,'M50 46L40 64L52 64L44 86','M70 60C76 62 80 68 78 74']],
  ['violao','Violão',['M40 56C28 56 26 74 36 80C44 86 58 86 64 80C74 72 70 56 60 56C64 48 58 40 50 42C42 40 36 48 40 56Z',C(50,66,5),'M52 42L70 10','M48 42L66 10']],
  ['riacho','Riacho correndo',['M30 10C40 30 20 40 40 56S70 70 60 92','M44 10C54 30 34 40 54 56S84 70 74 92',C(20,70,5),C(84,40,4)]],
  ['ventoarv','Vento nas árvores',['M30 92L30 60','M30 60C14 60 12 40 24 36C22 24 40 20 44 32C56 30 56 50 44 56C40 62 34 62 30 60Z','M58 40C70 36 80 44 92 38','M60 54C72 50 82 58 94 52','M56 68C68 64 78 72 90 66']]
 ]},
 tato:{pintor:'Picasso',ops:[
  ['veludo','Veludo',['M10 18L90 18','M16 20C30 30 30 70 18 86','M36 18C50 34 46 70 40 88','M58 18C68 34 66 70 62 88','M80 20C88 34 86 70 84 86']],
  ['areia','Areia',['M6 70C26 56 44 58 60 66S86 60 96 54','M6 84C30 74 56 76 96 80',C(74,30,8),C(30,40,1),C(40,48,1),C(24,52,1),C(52,44,1)]],
  ['agua','Água',['M50 14C36 36 28 50 28 62C28 76 38 86 50 86C62 86 72 76 72 62C72 50 64 36 50 14Z','M40 64C40 72 44 76 50 76','M14 94C30 88 70 88 86 94']],
  ['madeira','Madeira',['M14 30L86 30L86 76L14 76Z','M14 42C40 38 56 48 86 44','M14 62C34 58 50 70 86 64',E(54,53,6,4)]],
  ['la','Lã de tricô',[C(46,56,24),'M28 40C40 50 54 52 66 44','M24 56C38 66 56 68 70 58','M30 72C42 78 56 78 64 72','M66 16L82 80','M80 14L64 82']],
  ['grama','Grama',['M14 90C16 70 12 56 8 46','M26 90C28 66 32 52 38 42','M40 90C40 70 44 56 50 40','M54 90C56 72 60 60 68 50','M68 90C68 72 72 58 80 48','M82 90C82 74 86 64 92 58']],
  ['seda','Seda',['M8 30C30 10 50 50 70 30S92 20 96 40','M8 46C30 26 50 66 70 46S92 36 96 56','M8 62C30 42 50 82 70 62S92 52 96 72']],
  ['massinha','Massinha de modelar',['M30 70C18 66 20 46 34 44C36 30 56 28 62 40C76 38 82 56 72 64C70 76 46 80 30 70Z','M44 54C48 50 54 50 58 54','M42 60C48 54 56 54 62 60']],
  ['pedrinhas','Pedrinhas de rio',[E(30,70,14,9),E(58,76,12,8),E(46,54,10,7),E(76,60,9,6),'M10 36C30 32 60 40 90 34']],
  ['bolha','Plástico bolha',[C(30,34,7),C(50,34,7),C(70,34,7),C(30,54,7),C(50,54,7),C(70,54,7),C(30,74,7),C(50,74,7),'M64 70L76 78','M76 70L64 78']],
  ['toalha','Toalha felpuda',['M18 40L82 40L82 64L18 64Z','M18 64L82 64L78 80L22 80Z','M28 46L28 50','M40 46L40 50','M52 46L52 50','M64 46L64 50','M76 46L76 50']],
  ['marmore','Mármore gelado',['M16 30L84 30L84 80L16 80Z','M24 36C34 46 30 58 44 66S60 78 64 80','M50 30C54 40 66 44 70 56','M76 12L76 22','M71 17L81 17']],
  ['espuma','Espuma de banho',[C(30,50,12),C(52,42,16),C(72,56,10),C(44,66,8),C(66,26,6),C(22,30,5),'M8 80L92 80']],
  ['pelo','Pelo de bichinho',['M16 50C20 42 24 42 26 50','M30 46C34 38 38 38 40 46','M44 50C48 42 52 42 54 50','M58 46C62 38 66 38 68 46','M72 50C76 42 80 42 82 50','M22 66C26 58 30 58 32 66','M38 62C42 54 46 54 48 62','M54 66C58 58 62 58 64 66','M70 62C74 54 78 54 80 62','M40 84C52 78 66 78 78 84']],
  ['papel','Papel amassado',['M30 30L52 22L72 32L78 54L68 76L44 80L24 68L20 46Z','M30 30L44 50L52 22','M44 50L72 32','M44 50L78 54','M44 50L44 80','M44 50L20 46']]
 ]},
 olf:{pintor:'Frida Kahlo',ops:[
  ['cafecoado','Café coado',['M28 50L72 50L68 80L32 80Z','M72 56C84 56 84 70 70 70','M40 42C36 34 44 30 40 22','M52 42C48 34 56 30 52 22','M64 42C60 34 68 30 64 22']],
  ['chuvaterra','Chuva na terra',['M8 76L92 76','M30 22L28 32','M50 18L48 28','M70 22L68 32','M36 70C32 62 40 58 36 50','M64 70C60 62 68 58 64 50','M50 76L50 62','M50 66C44 60 40 62 40 62','M50 66C56 60 60 62 60 62']],
  ['bolo','Bolo no forno',['M14 22L86 22L86 86L14 86Z','M22 40L78 40L78 78L22 78Z',C(30,31,3),C(44,31,3),'M36 72L64 72L64 62C64 54 36 54 36 62Z','M50 52C46 48 54 46 50 42']],
  ['maresia','Maresia',['M8 70C20 60 32 80 44 70S68 60 80 70S92 76 96 72','M8 84C24 76 40 90 56 84S80 76 96 84','M56 30C60 26 64 26 66 30C68 26 72 26 76 30','M12 42C24 38 32 46 44 42']],
  ['roupa','Roupa limpa',['M6 24C30 34 70 34 94 24','M28 30L20 40L26 46L30 42L30 72L54 72L54 42L58 46L64 40L56 30L48 33C46 37 38 37 36 33Z','M76 50L76 60','M71 55L81 55']],
  ['gramacort','Grama cortada',['M6 80L94 80','M12 80L14 66L16 80','M24 80L26 64L28 80','M36 80L38 66L40 80','M48 80L50 64L52 80','M60 80L62 66L64 80','M72 80L74 64L76 80','M84 80L86 66L88 80','M60 40L64 36','M70 30L74 28','M52 30L54 26']],
  ['laranjeira','Flor de laranjeira',[C(50,28,9),C(68,42,9),C(62,62,9),C(38,62,9),C(32,42,9),C(50,46,6),'M50 72L50 94']],
  ['canela','Canela',['M20 70L70 30','M26 76L76 36','M70 30C76 26 82 32 76 36','M20 70C14 74 20 80 26 76','M40 30C36 24 44 20 40 14']],
  ['pao','Pão quentinho',['M16 66C16 46 30 40 50 40C70 40 84 46 84 66Z','M16 66L84 66','M32 48L38 58','M46 46L52 58','M60 46L66 58','M40 32C36 26 44 22 40 16','M58 32C54 26 62 22 58 16']],
  ['eucalipto','Eucalipto',['M20 90C40 70 56 46 80 14',C(34,70,7),C(52,62,6),C(48,50,7),C(66,46,6),C(62,32,6),C(78,26,5)]],
  ['pipocacine','Pipoca de cinema',['M30 46L70 46L64 90L36 90Z','M42 46L44 90','M56 46L54 90',C(36,40,7),C(48,34,8),C(62,40,7),C(42,24,6),C(56,22,6)]],
  ['laranja','Laranja descascada',[C(46,58,22),'M46 36L46 80','M28 48L64 68','M28 68L64 48','M62 40C76 30 86 40 80 52C76 60 86 68 92 64']],
  ['livro','Livro novo',['M50 30C40 24 22 24 12 28L12 78C22 74 40 74 50 80C60 74 78 74 88 78L88 28C78 24 60 24 50 30Z','M50 30L50 80','M20 40L42 40','M20 50L42 50','M58 40L80 40','M58 50L80 50','M50 20C46 14 54 10 50 4']],
  ['protetor','Protetor solar',['M36 30L64 30L66 86L34 86Z','M42 30L42 20L58 20L58 30',C(50,58,8),'M50 44L50 40','M50 72L50 76','M36 58L32 58','M64 58L68 58']],
  ['bebe','Cheirinho de bebê',['M36 20L64 20L76 32L68 40L64 36L64 70C64 78 58 84 50 84C42 84 36 78 36 70L36 36L32 40L24 32Z',C(46,78,1.5),C(54,78,1.5),'M44 12C40 6 48 2 44 -2']]
 ]},
 pal:{pintor:'Monet',ops:[
  ['mel','Doce (mel)',['M30 40L70 40L72 86L28 86Z','M34 30L66 30L66 40L34 40Z','M60 8L52 44','M40 40C40 48 44 50 44 56']],
  ['salgado','Salgado',['M34 40C34 28 66 28 66 40L70 86L30 86Z',C(44,34,1.5),C(50,32,1.5),C(56,34,1.5),'M50 14L50 17','M44 6L44 9','M56 8L56 11']],
  ['limao','Azedinho (limão)',[C(50,56,26),C(50,56,20),'M50 36L50 76','M30 56L70 56','M36 42L64 70','M64 42L36 70']],
  ['chocolate','Amargo (chocolate)',['M24 24L76 24L76 84L24 84Z','M24 44L76 44','M24 64L76 64','M50 24L50 84','M76 24C70 28 70 34 76 38']],
  ['picante','Picante',['M30 30C24 50 36 76 68 86C80 88 84 82 74 76C52 64 44 46 44 30Z','M36 30C36 22 42 18 48 18','M66 30C62 24 70 20 66 14','M78 40C74 34 82 30 78 24']],
  ['hortela','Fresco (hortelã)',['M50 88L50 40','M50 62C34 60 26 48 28 36C42 36 50 46 50 62','M50 52C66 50 74 38 72 26C58 26 50 36 50 52','M78 62L78 70','M74 66L82 66']],
  ['caldo','Caldo quentinho',['M16 52C16 76 84 76 84 52Z','M12 52L88 52','M66 30L84 14','M36 44C32 36 40 32 36 24','M50 44C46 36 54 32 50 24']],
  ['cafe','Café',['M30 44L70 44L66 72L34 72Z','M70 50C80 50 80 64 68 64','M20 78L80 78','M44 36C40 28 48 24 44 16','M56 36C52 28 60 24 56 16']],
  ['sorvete','Gelado (sorvete)',['M36 50L64 50L50 92Z','M40 60L60 60','M44 70L56 70',C(42,42,11),C(58,40,11),C(50,26,10)]],
  ['paoqueijo','Pão de queijo',[C(34,58,14),C(64,54,16),C(50,78,12),'M28 54C32 52 36 54 40 52','M58 48C62 46 66 48 70 46']],
  ['cha','Chá quentinho',['M28 48L72 48L68 76L32 76Z','M72 54C82 54 82 68 70 68','M20 80L80 80','M52 48L58 28','M56 20L66 20L66 30L56 30Z','M40 40C36 32 44 28 40 20']],
  ['brigadeiro','Brigadeiro',[C(50,46,16),'M28 60L72 60L66 82L34 82Z','M38 60L40 82','M50 60L50 82','M62 60L60 82','M44 38L46 40','M54 36L56 34','M50 46L52 48','M42 48L44 46','M58 46L60 48']],
  ['pipocadoce','Pipoca doce',['M30 44L70 44L50 92Z','M40 44L50 92','M60 44L50 92',C(38,38,7),C(50,32,8),C(62,38,7),C(44,24,6),C(58,22,5)]],
  ['pastel','Pastel de feira',['M14 66C14 40 40 26 60 30C78 34 88 50 86 66Z','M14 66L86 66','M22 66L22 71','M34 66L34 71','M46 66L46 71','M58 66L58 71','M70 66L70 71','M80 66L80 71','M48 22C44 16 52 12 48 6']],
  ['coco','Água de coco',[C(46,60,24),'M54 40L70 10L76 12',C(54,42,3),'M30 50C34 46 40 44 44 44']]
 ]},
 equi:{pintor:'Dalí',ops:[
  ['rede','Balanço de rede',['M10 20L10 30','M90 20L90 30','M10 30C30 70 70 70 90 30','M10 30C30 56 70 56 90 30','M40 84C46 80 54 80 60 84']],
  ['onda','Ir e vir de onda',['M8 60C20 40 36 40 46 56C50 62 58 62 60 54','M8 72C30 64 60 80 92 70','M70 30L86 30','M80 24L86 30L80 36','M30 86L14 86','M20 80L14 86L20 92']],
  ['girar','Girar devagar',['M50 50C54 46 58 52 54 56C48 62 40 54 44 46C50 36 64 42 62 56C60 70 40 72 34 58C26 42 40 26 58 28C78 30 82 56 72 68','M72 68L65 68','M72 68L72 61']],
  ['gangorra','Gangorra',['M44 80L56 80L50 66Z','M14 76L86 56','M14 76L14 70','M86 56L86 50','M8 86L92 86']],
  ['pedalar','Pedalar',[C(28,64,16),C(72,64,16),'M28 64L44 40L64 40L72 64','M44 40L50 64L28 64','M50 64L64 40','M60 34L70 34','M40 34L48 34']],
  ['dancalenta','Dança lenta',[C(42,20,6),C(58,22,6),'M42 26C38 46 40 60 36 88','M58 28C62 48 60 62 64 88','M42 38C50 34 56 36 58 40','M20 50C16 56 16 62 20 68','M80 50C84 56 84 62 80 68']],
  ['pular','Pular',[C(50,20,7),'M50 28L50 54','M50 36L36 26','M50 36L64 26','M50 54L40 66','M50 54L62 64','M38 90L62 90','M30 80C40 76 60 76 70 80']],
  ['carrossel','Carrossel',['M20 34L50 14L80 34Z','M50 14L50 8','M30 34L30 80','M50 34L50 80','M70 34L70 80','M16 80L84 80',C(30,58,5),C(70,52,5)]],
  ['meiofio','Andar no meio-fio',['M6 72L94 72','M6 80L94 80',C(50,14,6),'M50 20L50 44','M50 28L24 24','M50 28L76 24','M50 44L44 64','M50 44L56 64']],
  ['cambalhota','Cambalhota',['M30 70C20 50 40 24 60 30C80 36 82 62 66 72',C(30,70,6),'M66 72L59 70','M66 72L64 65','M10 84L90 84']],
  ['umpe','Ficar num pé só',[C(50,14,6),'M50 20L50 50','M50 28L30 38','M50 28L70 38','M50 50L50 84','M50 58L64 52L60 64','M30 86L70 86']],
  ['parquinho','Balanço de parquinho',['M20 90L34 14L66 14L80 90','M44 14L44 62','M56 14L56 62','M40 62L60 62','M30 72C36 80 64 80 70 72']],
  ['cavalinho','Cavalinho de balanço',['M14 82C34 94 66 94 86 82','M30 64L64 64C70 64 72 58 68 54L64 48L70 38L76 42L74 32L64 32L58 44L32 48C26 50 26 60 30 64Z','M34 64L30 82','M62 64L68 82']],
  ['barquinho','Barquinho no mar',['M20 60L80 60L70 74L30 74Z','M50 60L50 20L74 54Z','M8 84C20 76 32 92 44 84S68 76 80 84S92 90 96 86']],
  ['montanha','Montanha-russa',['M6 80C20 80 24 30 38 30C52 30 50 70 62 70C74 70 76 20 94 20','M38 30L38 92','M62 70L62 92','M20 66L20 92','M80 34L80 92','M30 40L40 32']]
 ]},
 mapa:{pintor:'Van Gogh',ops:[
  ['esboco','O Esboço da Alma',['M20 70C20 40 50 20 60 40C70 60 40 70 50 50C56 38 80 36 82 60','M70 82L88 64L92 68L74 86Z']],
  ['redemoinho','Céu em Redemoinho',['M20 40C20 28 36 26 38 36C40 46 26 46 28 38','M50 30C50 14 76 14 76 32C76 50 50 48 54 34','M8 72C28 58 50 82 70 68S90 64 96 60',C(86,14,3)]],
  ['facetas','Retrato em Facetas',['M30 20L70 20L76 50L60 86L36 80L24 50Z','M50 20L50 86','M24 50L76 50',C(40,38,4),'M58 64L66 60']],
  ['nascer','Nascer das Sensações',['M6 70L94 70','M28 70C28 44 72 44 72 70','M50 36L50 26','M26 48L18 42','M74 48L82 42','M16 62L8 60','M84 62L92 60']],
  ['derrete','O Tempo que Derrete',['M24 40C24 26 72 22 76 38C80 52 70 56 66 66C62 76 62 88 56 88C50 88 52 70 40 66C28 62 24 54 24 40Z','M48 42L48 32','M48 42L58 46']],
  ['luzescuro','Luz no Escuro',['M44 52L56 52L56 88L44 88Z','M50 22C44 32 44 40 50 46C56 40 56 32 50 22Z','M50 48L50 52',C(50,36,24)]],
  ['jardim','Jardim de Coragem',['M30 90L30 56','M50 90L50 46','M70 90L70 60',C(30,50,7),C(50,38,8),C(70,54,6),'M50 72C42 68 38 62 38 62','M30 74C36 70 40 70 40 70']],
  ['mosaico','Mosaico Dourado',['M18 18L44 18L44 44L18 44Z','M48 18L82 18L82 40L48 40Z','M18 48L40 48L40 82L18 82Z','M44 48L82 44L82 82L44 82Z','M54 54L70 54L70 70L54 70Z']],
  ['estrelado','Céu estrelado',['M78 18C70 20 66 30 72 38C64 40 56 32 58 22C60 14 72 10 78 18Z','M20 26L20 36','M15 31L25 31','M40 16L40 24','M36 20L44 20','M34 50L34 58','M30 54L38 54','M62 58L62 64','M59 61L65 61','M6 86C30 72 60 76 94 84']],
  ['fundomar','Fundo do mar',['M30 50C40 40 56 40 62 50C56 60 40 60 30 50Z','M62 50L72 42L72 58Z',C(40,26,3),C(46,17,2),C(36,12,2),'M82 92C76 80 88 72 82 60','M16 92C10 80 22 72 16 60']],
  ['pordosol','Pôr do sol na praia',['M6 60L94 60','M30 60C30 38 70 38 70 60','M38 68L62 68','M42 74L58 74','M46 80L54 80']],
  ['fogos','Fogos de Ano Novo',['M36 36L36 18','M36 36L50 26','M36 36L54 38','M36 36L46 50','M36 36L24 50','M36 36L18 36','M36 36L22 24','M68 56L68 44','M68 56L78 48','M68 56L80 60','M68 56L60 66','M68 56L58 50','M44 92C44 80 40 66 36 52']],
  ['cidade','Luzes da cidade à noite',['M6 86L6 60L18 60L18 46L30 46L30 66L40 66L40 34L54 34L54 58L64 58L64 44L78 44L78 70L94 70L94 86Z','M45 40L48 40','M45 48L48 48','M22 52L25 52','M68 50L71 50','M68 58L71 58','M84 76L87 76']],
  ['bandeirinhas','Bandeirinhas de festa junina',['M6 20C30 32 70 32 94 20','M14 23L24 27L18 38Z','M34 28L44 30L38 42Z','M54 30L64 28L58 42Z','M74 26L84 22L78 36Z','M6 54C30 66 70 66 94 54','M24 60L34 62L28 74Z','M46 64L56 64L50 76Z','M68 62L78 58L72 72Z']],
  ['arcoiris','Arco-íris depois da chuva',['M14 76C14 36 86 36 86 76','M24 76C24 46 76 46 76 76','M34 76C34 56 66 56 66 76','M66 84C60 84 58 76 64 74C64 68 74 66 76 72C82 70 86 78 80 84Z','M20 84L18 90']]
 ]}
};

/* fundo no estilo do pintor do sentido */
function fundoPintor(p,id){
  const k=id.length;
  if(p==='Klimt'){let t='';for(let i=0;i<7;i++)for(let j=0;j<7;j++){if((i+j+k)%3===0)t+=`<rect x="${i*15+2}" y="${j*15+2}" width="8" height="8" fill="#8A6414" opacity=".35"/>`;else if((i*j+k)%4===0)t+=`<circle cx="${i*15+7}" cy="${j*15+7}" r="4" fill="none" stroke="#7A5610" stroke-width=".8" opacity=".5"/>`}
    return {bg:`<defs><radialGradient id="kb${id}" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#F6D77A"/><stop offset="1" stop-color="#B8862A"/></radialGradient></defs><rect width="100" height="100" fill="url(#kb${id})"/>${t}`,ink:'#1E1408'}}
  if(p==='Picasso'){return {bg:`<rect width="100" height="100" fill="#D9C7A3"/><path d="M0 0L60 0L30 50Z" fill="#7C93B0" opacity=".55"/><path d="M60 0L100 0L100 45L55 60Z" fill="#C9763E" opacity=".45"/><path d="M0 50L30 50L45 100L0 100Z" fill="#8E8A80" opacity=".45"/><path d="M55 60L100 45L100 100L60 100Z" fill="#4E6C8A" opacity=".4"/><path d="M30 50L55 60L60 100L45 100Z" fill="#E8D8B4" opacity=".6"/>`,ink:'#15120E'}}
  if(p==='Frida Kahlo'){let f='';[[10,10],[90,12],[8,90],[92,88],[50,6],[6,50],[94,52]].forEach(([x,y],i)=>{f+=`<circle cx="${x}" cy="${y}" r="5" fill="${i%2?'#D8363C':'#F2B632'}" opacity=".85"/><path d="M${x-9} ${y+3}C${x-5} ${y-3} ${x} ${y+1} ${x-2} ${y+6}Z" fill="#2E7D4F" opacity=".8"/>`});
    return {bg:`<rect width="100" height="100" fill="#2F6B4A"/><rect x="12" y="12" width="76" height="76" rx="6" fill="#F3E6CC"/>${f}`,ink:'#7A1E22'}}
  if(p==='Monet'){let d='';const cs=['#9EC9E0','#C8B6E2','#A8D8B0','#F2D6A2','#E9B8C8'];for(let i=0;i<34;i++){const x=(i*29+k*7)%100,y=(i*47+k*11)%100;d+=`<ellipse cx="${x}" cy="${y}" rx="${6+i%5}" ry="${3+i%3}" fill="${cs[i%5]}" opacity=".55"/>`}
    return {bg:`<defs><filter id="mb${id}"><feGaussianBlur stdDeviation="1.4"/></filter></defs><rect width="100" height="100" fill="#DCE8EE"/><g filter="url(#mb${id})">${d}</g>`,ink:'#2A3A66'}}
  if(p==='Dalí'){return {bg:`<defs><linearGradient id="db${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB7D6"/><stop offset=".6" stop-color="#F3D9A0"/><stop offset="1" stop-color="#C98E4A"/></linearGradient></defs><rect width="100" height="100" fill="url(#db${id})"/><path d="M0 72L100 66" stroke="#8A5A2A" stroke-width=".6" opacity=".6"/><path d="M60 96L96 80L100 86L68 100Z" fill="#6B4020" opacity=".25"/>`,ink:'#3A2210'}}
  if(p==='Van Gogh'){let w='';for(let i=0;i<18;i++){const x=(i*31+k*5)%100,y=(i*17+k*9)%100;w+=`<path d="M${x} ${y}c4 -3 8 -1 10 2" stroke="${i%3?'#4C7BD9':'#F5D04A'}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>`}
    return {bg:`<rect width="100" height="100" fill="#14306E"/>${w}`,ink:'#FFE27A'}}
  return {bg:'<rect width="100" height="100" fill="#ddd"/>',ink:'#222'};
}
const ABRE='<svg x="0" y="0" width="300" height="300" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">';
function pintor(p,id,paths){
  const f=fundoPintor(p,id), s=paths.map(d=>`<path d="${d}"/>`).join('');
  return `${ABRE}${f.bg}<g fill="none" stroke="${f.ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${s}</g><g fill="none" stroke="${f.ink}" stroke-width=".7" stroke-linecap="round" opacity=".45" transform="translate(1 .8)">${s}</g></svg>`;
}
function luz(id,paths){
  const s=paths.map(d=>`<path d="${d}"/>`).join('');
  let st='';for(let i=0;i<14;i++){const x=(i*37+id.length*13)%100,y=(i*53+id.length*7)%100;st+=`<circle cx="${x}" cy="${y}" r="${(i%3)*.25+.3}" fill="#fff" opacity="${.2+(i%4)*.1}"/>`}
  return `${ABRE}<defs><radialGradient id="lg${id}" cx="50%" cy="45%" r="70%"><stop offset="0" stop-color="#1C2563"/><stop offset="1" stop-color="#070A1E"/></radialGradient><filter id="gl${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="100" height="100" fill="url(#lg${id})"/>${st}<g fill="none" stroke="#F5C542" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" filter="url(#gl${id})">${s}</g></svg>`;
}
const A={corpo:{}};
CORPO.forEach(([id,n,p])=>{A.corpo[n]=luz('c_'+id,p);});
Object.entries(OUTROS).forEach(([k,S])=>{A[k]={};S.ops.forEach(([id,n,p])=>{A[k][n]=pintor(S.pintor,k+'_'+id,p);});});
window.ARTE7=A;
/* traços puros (viewBox 0 0 100 100) de cada opção, para montar o quadro dos 7 sentidos (quadro7.js) */
const PT={corpo:{}};CORPO.forEach(([id,n,p])=>{PT.corpo[n]=p;});
Object.entries(OUTROS).forEach(([k,S])=>{PT[k]={};S.ops.forEach(([id,n,p])=>{PT[k][n]=p;});});
window.ARTE7_PATHS=PT;
window.ARTE7_VISAO_ID={};OUTROS.mapa.ops.forEach(([id,n])=>{window.ARTE7_VISAO_ID[n]=id;});
/* troca a arte das opções de uma lista SEN = [[id, nome, ícone, cor, texto, opções], ...] */
window.aplicarArte7=function(SEN){SEN.forEach(s=>{const M=A[s[0]];if(!M)return;s[5].forEach(t=>{if(M[t.n]){const svg=M[t.n];t.art=()=>svg;t.arte7=true;}});});};
})();
