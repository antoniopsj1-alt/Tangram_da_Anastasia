/* ===================== DADOS DAS PEÇAS ===================== */
const PIECES = {
  l1:{w:113.14,h:113.14,shape:'tri',color:'#FF0055'}, 
  l2:{w:113.14,h:113.14,shape:'tri',color:'#FF9900'},
  m:{w:80,h:80,shape:'tri',color:'#39FF14'},
  s1:{w:56.57,h:56.57,shape:'tri',color:'#FFFF00'},
  s2:{w:56.57,h:56.57,shape:'tri',color:'#0077FF'},
  sq:{w:56.57,h:56.57,shape:'sq',color:'#9D00FF'},
  pa:{w:120,h:40,shape:'par',color:'#00FFCC'}
};
/* ===================== MODO MONOCROMÁTICO ===================== */
const MONO_COLORS = [
  {name:'Azul',     hex:'#2563EB'},
  {name:'Vermelho', hex:'#DC2626'},
  {name:'Verde',    hex:'#16A34A'},
  {name:'Preto',    hex:'#111827'},
  {name:'Dourado',  hex:'#D4AF37', fill:'linear-gradient(135deg,#FFF3B0 0%,#F5D060 22%,#D4AF37 48%,#A87B12 74%,#F2CF63 100%)'},
  {name:'Chocolate',hex:'#5C3317'}
];
const MONO = { on:false, color:MONO_COLORS[0].hex, fill:null };
// Cor efetiva de uma peça: a original, ou a cor única escolhida no modo monocromático.
function pieceColor(id){ return MONO.on ? (MONO.fill || MONO.color) : PIECES[id].color; }
function applyMonoTheme(){
  document.body.classList.toggle('mono', MONO.on);
  const h = MONO.color.replace('#','');
  const lum = (0.299*parseInt(h.substr(0,2),16) + 0.587*parseInt(h.substr(2,2),16) + 0.114*parseInt(h.substr(4,2),16))/255;
  document.body.style.setProperty('--edge', lum>0.5 ? 'rgba(15,23,42,.85)' : 'rgba(255,255,255,.85)');
}
const CLIP = {tri:'polygon(0 0,100% 0,0 100%)', par:'polygon(0% 100%,66% 100%,100% 0%,34% 0%)', sq:'polygon(0 0,100% 0,100% 100%,0 100%)'};
/* Nome amigável + cor (para as instruções faladas do Modo Criativo) */
const PIECE_INFO = {
  l1:{label:'Triângulo Grande 1', colorName:'Rosa Neon'},
  l2:{label:'Triângulo Grande 2', colorName:'Laranja Tangerina'},
  m :{label:'Triângulo Médio', colorName:'Verde Limão'},
  s1:{label:'Triângulo Pequeno 1', colorName:'Amarelo Laser'},
  s2:{label:'Triângulo Pequeno 2', colorName:'Azul Elétrico'},
  sq:{label:'Quadrado', colorName:'Roxo Violeta'},
  pa:{label:'Paralelogramo', colorName:'Ciano / Turquesa'},
};

/* =========================================================================
   FIGURAS — CADASTRE AQUI QUANTAS FIGURAS QUISER, PARA QUALQUER TEMA
   =========================================================================
   Cada figura é um objeto com:
     name    : nome exibido para o jogador
     emoji   : ícone mostrado nos botões de seleção
     themes  : lista de temas aos quais ela pertence (uma figura pode
               aparecer em mais de um tema, ex: ['Números','Formas Geométricas'])
     p       : posição de CADA uma das 7 peças quando a figura está montada
               corretamente, no sistema de coordenadas do canvas 430x430:
                 cx, cy = centro da peça (0,0 = canto superior esquerdo)
                 r      = rotação em graus (múltiplos de 45: 0,45,90...315)

   Peças disponíveis (id : tamanho aproximado):
     l1, l2 = triângulos grandes (80x80)   m = triângulo médio (57x57)
     s1, s2 = triângulos pequenos (40x40)  sq = quadrado (40x40)
     pa     = paralelogramo (60x40)

   Para adicionar uma nova figura, copie um bloco abaixo, troque o id
   (ex: "cachorro"), o nome/emoji/temas, e ajuste os 7 cx/cy/r até o
   desenho ficar do jeito que você quiser. Não há limite de quantidade —
   pode ter 1 ou 50 figuras no mesmo tema, o jogo e o Modo Criativo
   detectam automaticamente todas as que existirem aqui.
   ========================================================================= */
const FIGURES = {
 'Mulher Andando':{name:'Mulher Andando',emoji:'👩🚶‍♀️',themes:['Pessoas'],p:{
   s1:{cx:91.72,cy:351.61,r:180}, s2:{cx:273.14,cy:351.61,r:90}, pa:{cx:296.57,cy:78.47,r:45}, m:{cx:120.00,cy:283.32,r:180},
   sq:{cx:200.00,cy:50.19,r:45}, l1:{cx:200,cy:170.19,r:315}, l2:{cx:216.57,cy:266.76,r:270} }},
 'Homem Orando':{name:'Homem Orando',emoji:'🙏🧎‍♂️',themes:['Pessoas'],p:{
   s1:{cx:128.28,cy:71.72,r:270}, s2:{cx:140.00,cy:100.00,r:225}, l1:{cx:220.00,cy:140.00,r:315}, l2:{cx:140.00,cy:220.00,r:135}, 
   m:{cx:196.57,cy:300.00,r:45}, sq:{cx:200.00,cy:40.00,r:45}, pa:{cx:253.14,cy:271.72,r:45} }},
'Mulher Parada':{name:'Mulher Parada',emoji:'👩🧍‍♀️',themes:['Pessoas'],p:{
   s1:{cx:131.72,cy:68.28,r:180}, s2:{cx:220.00,cy:140.00,r:135}, l1:{cx:240.00,cy:240.00,r:315}, l2:{cx:160.00,cy:320.00,r:135}, 
   m:{cx:200.00,cy:360.00,r:180}, sq:{cx:200.00,cy:40.00,r:45}, pa:{cx:200.00,cy:120,r:90} }},
'Homem Vietnamita':{name:'Homem Vietnamita',emoji:'👨‍🌾',themes:['Pessoas'],p:{
   s1:{cx:200,cy:56.57,r:270}, s2:{cx:171.72,cy:339.41,r:180}, l1:{cx:171.72,cy:141.42,r:180}, l2:{cx:200.00,cy:56.57,r:90}, 
   m:{cx:211.72,cy:237.97,r:90}, sq:{cx:200.00,cy:282.84,r:0}, pa:{cx:171.72,cy:226.27,r:45} }},


   Gato:{name:'Gato',emoji:'🐱',themes:['Animais'],p:{
   l1:{cx:143.43,cy:215.26,r:0}, m:{cx:200.00,cy:215.26,r:45}, s1:{cx:353.14,cy:78.69,r:315}, s2:{cx:273.14,cy:78.69,r:135},
   pa:{cx:66.86,cy:98.69,r:90}, sq:{cx:313.14,cy:118.69,r:45}, l2:{cx:256.57,cy:215.26,r:90} }},
  Coelho:{name:'Coelho',emoji:'🐇',themes:['Animais'],p:{
   sq:{cx:138.58,cy:141.42,r:0}, m:{cx:240.00,cy:327.70,r:270}, s1:{cx:200,cy:327.70,r:315}, s2:{cx:166.86,cy:254.56,r:315},
   pa:{cx:195.15,cy:56.57,r:135}, l1:{cx:223.43,cy:197.99,r:270}, l2:{cx:223.43,cy:311.13,r:90} }},
  Cachorro:{name:'Cachorro',emoji:'🐶',themes:['Animais'],p:{
   sq:{cx:299.07,cy:95,r:0}, m:{cx:190.78,cy:185.46,r:45}, s1:{cx:134.22,cy:225.46,r:315}, s2:{cx:94.22,cy:84.03,r:270},
   pa:{cx:247.35,cy:213.74,r:45}, l1:{cx:150.78,cy:168.89,r:0}, l2:{cx:270.78,cy:128.89,r:315} }},
  Peixe:{name:'Peixe',emoji:'🐟',themes:['Animais'],p:{
   sq:{cx:183.21,cy:230.00,r:45}, m:{cx:199.78,cy:70.00,r:315}, s1:{cx:308.07,cy:121.72,r:0}, s2:{cx:251.50,cy:121.72,r:180},
   pa:{cx:279.78,cy:178.28,r:45}, l1:{cx:143.21,cy:150.00,r:315}, l2:{cx:143.21,cy:150.00,r:135} }},


   Casa:{name:'Casa',emoji:'🏠',themes:['Objetos'],p:{
   sq:{cx:201.72,cy:55.15,r:0}, pa:{cx:230,cy:111.72,r:45}, l1:{cx:150,cy:140,r:45}, l2:{cx:178.28,cy:220,r:45},
   m:{cx:218.28,cy:180,r:90}, s1:{cx:138.28,cy:140,r:225}, s2:{cx:98.28,cy:180,r:135} }},
   Chave:{name:'Chave',emoji:'🔑',themes:['Objetos'],p:{
   sq:{cx:68.67,cy:115.27,r:0}, pa:{cx:196.95,cy:106.98,r:0}, l1:{cx:296.95,cy:126.98,r:315}, l2:{cx:296.95,cy:126.98,r:135},
   m:{cx:136.95,cy:126.98,r:0}, s1:{cx:136.95,cy:166.98,r:315}, s2:{cx:68.67,cy:171.83,r:0} }},
   Cadeira:{name:'Cadeira',emoji:'🪑',themes:['Objetos'],p:{
   sq:{cx:256.57,cy:271.72,r:0}, pa:{cx:256.57,cy:130.29,r:135}, l1:{cx:228.28,cy:186.86,r:180}, l2:{cx:171.72,cy:243.43,r:0},
   m:{cx:228.28,cy:73.73,r:135}, s1:{cx:256.57,cy:45.44,r:90}, s2:{cx:143.43,cy:271.72,r:180} }},
   Espada:{name:'Espada',emoji:'⚔️',themes:['Objetos'],p:{
   sq:{cx:200.00,cy:308.28,r:0}, pa:{cx:200,cy:260.00,r:0}, l1:{cx:240.00,cy:160,r:315}, l2:{cx:160,cy:80,r:135},
   m:{cx:200,cy:200,r:270}, s1:{cx:260.00,cy:280.00,r:45}, s2:{cx:140.00,cy:240.00,r:225} }},



   Barco:{name:'Barco',emoji:'🚢',themes:['Transporte'],p:{
   sq:{cx:200.00,cy:111.72,r:0}, pa: { cx: 300.00, cy: 160.00, r: 0}, l1:{cx:200.00,cy:220.00,r:45}, l2:{cx:120.00,cy:140.00,r:225},
   m:{cx:200.00,cy:83.43,r:45}, s1:{cx:280.00,cy:180.00,r:225}, s2:{cx:240.00,cy:140.00,r:225} }},
   Carro:{name:'Carro',emoji:'🚗',themes:['Transporte'],p:{
   sq:{cx:86.20,cy:234.12,r:45}, pa: { cx: 260.00, cy: 174.12, r: 0}, l1:{cx:200.00,cy:114.12,r:225}, l2:{cx:120.00,cy:194.12,r:45},
   m:{cx:280.00,cy:114.12,r:180}, s1:{cx:280.00,cy:234.12,r:45}, s2:{cx:280.00,cy:234.12,r:225} }},
   Motocicleta:{name:'Motocicleta',emoji:'🏍️',themes:['Transporte'],p:{
   sq:{cx:262.33,cy:203.86,r:45}, pa: { cx: 317.33, cy: 138.86, r: 0}, l1:{cx:217.33,cy:118.86,r:225}, l2:{cx:145.76,cy:127.29,r:270},
   m:{cx:89.19,cy:70.72,r:315}, s1:{cx:69.19,cy:203.86,r:135}, s2:{cx:69.19,cy:203.86,r:315} }},
   Avião:{name:'Avião',emoji:'✈️',themes:['Transporte'],p:{
   sq:{cx:283.25,cy:171.42,r:0}, pa: { cx: 81.83, cy: 163.14, r: 0}, l1:{cx:198.40,cy:199.71,r:90}, l2:{cx:198.40,cy:86.57,r:180},
   m:{cx:328.10,cy:103.14,r:180}, s1:{cx:141.83,cy:183.14,r:45}, s2:{cx:339.82,cy:171.42,r:0} }},


 Quadrado:{name:'Quadrado',emoji:'🟦',themes:['Formas Geométricas'],p:{
   l1:{cx:200,cy:80,r:225}, l2:{cx:280,cy:160,r:315}, sq:{cx:200,cy:200,r:45}, pa:{cx:140,cy:140,r:90},
   m:{cx:160,cy:200,r:270}, s1:{cx:240,cy:240,r:45}, s2:{cx:160,cy:160,r:135} }},
 Hexágono:{name:'Hexágono',emoji:'⬢',themes:['Formas Geométricas'],p:{
   l1:{cx:200.00,cy:110.00,r:315}, l2:{cx:200.00,cy:110.00,r:135}, sq:{cx:160.00,cy:190.00,r:45}, pa:{cx:220.00,cy:210.00,r:0},
   m:{cx:240.00,cy:150.00,r:180}, s1:{cx:200.00,cy:230.00,r:225}, s2:{cx:120.00,cy:150.00,r:135} }},
 Coração:{name:'Coração',emoji:'❤️',themes:['Formas Geométricas'],p:{
   l1:{cx:240,cy:141.53,r:45}, l2:{cx:160,cy:141.53,r:225}, sq:{cx:200.00,cy:221.53,r:45}, pa:{cx:140.00,cy:121.53,r:0},
   m:{cx:280,cy:181.53,r:0}, s1:{cx:240.00,cy:181.53,r:315}, s2:{cx:160,cy:101.53,r:45} }},
 Estrela:{name:'Estrela',emoji:'⭐',themes:['Formas Geométricas'],p:{
   l1:{cx:285.8,cy:150.00,r:0}, l2:{cx:116.35,cy:150,r:90}, sq:{cx:201.20,cy:178.28,r:0}, pa:{cx:201.20,cy:93.43,r:315},
   m:{cx:116.35,cy:206.57,r:45}, s1:{cx:201.20,cy:234.85,r:90}, s2:{cx:201.20,cy:121.72,r:180} }},

 'Número Um':{name:'Número Um',emoji:'1️⃣',themes:['Números'],p:{
   sq:{cx:120,cy:140,r:45}, l1:{cx:240,cy:220,r:315}, l2:{cx:160,cy:140,r:135}, m:{cx:200,cy:260,r:270},
   pa:{cx:220,cy:80,r:90}, s1:{cx:200,cy:60,r:315}, s2:{cx:160,cy:100,r:315} }},
 'Número Dois':{name:'Número Dois',emoji:'2️⃣',themes:['Números'],p:{
   sq:{cx:171.72,cy:57.97,r:0}, l1:{cx:200,cy:109.69,r:135}, l2:{cx:143.43,cy:210,r:180}, m:{cx:256.57,cy:210,r:225},
   pa:{cx:115.15,cy:86.26,r:135}, s1:{cx:228.28,cy:238.28,r:270}, s2:{cx:115.15,cy:114.54,r:0} }},
 'Número Três':{name:'Número Três',emoji:'3️⃣',themes:['Números'],p:{
   sq:{cx:200,cy:57.97,r:0}, l1:{cx:228.28,cy:209.87,r:135}, l2:{cx:171.72,cy:233.30,r:270}, m:{cx:228.28,cy:86.26,r:135},
   pa:{cx:143.43,cy:86.26,r:135}, s1:{cx:228.28,cy:129.87,r:315}, s2:{cx:200,cy:261.59,r:90} }},
 'Número Quatro':{name:'Número Quatro',emoji:'4️⃣',themes:['Números'],p:{
   sq:{cx:262.49,cy:141.42,r:0}, l1:{cx:177.64,cy:169.71,r:270}, l2:{cx:234.21,cy:226.27,r:90}, m:{cx:177.64,cy:113.14,r:315},
   pa:{cx:149.36,cy:56.57,r:135}, s1:{cx:262.49,cy:254.56,r:270}, s2:{cx:319.06,cy:197.99,r:0} }},

'Letra A':{name:'Letra A',emoji:'Ⓐ',themes:['Alfabeto'],p:{
   l1:{cx:114.52,cy:173.43,r:135}, l2:{cx:227.66,cy:206.57,r:90}, sq:{cx:255.94,cy:121.72,r:0}, pa:{cx:227.66,cy:65.15,r:45},
   m:{cx:171.09,cy:93.43,r:45}, s1:{cx:194.52,cy:213.43,r:45}, s2:{cx:142.80,cy:121.72,r:90} }},
'Letra B':{name:'Letra B',emoji:'Ⓑ',themes:['Alfabeto'],p:{
   sq:{cx:280.00,cy:252.13,r:45}, l1:{cx:200,cy:292.13,r:45}, l2:{cx:160,cy:172.13,r:135}, m:{cx:181.01,cy:56.57,r:225},
   pa:{cx:263.43,cy:167.28,r:45}, s1:{cx:291.72,cy:223.85,r:90}, s2:{cx:235.15,cy:98.99,r:135} }},
'Letra C':{name:'Letra C',emoji:'Ⓒ',themes:['Alfabeto'],p:{
   sq:{cx:228.28,cy:41.72,r:0}, l1:{cx:200,cy:93.43,r:315}, l2:{cx:176.57,cy:150.00,r:270}, m:{cx:233.14,cy:206.57,r:225},
   pa:{cx:176.57,cy:234.85,r:45}, s1:{cx:261.42,cy:178.28,r:180}, s2:{cx:256.57,cy:53.43,r:135} }},
   'Letra D':{name:'Letra D',emoji:'Ⓓ',themes:['Alfabeto'],p:{
   l1:{cx:171.72,cy:93.43,r:0}, l2:{cx:171.72,cy:206.57,r:270}, sq:{cx:256.57,cy:121.72,r:0}, pa:{cx:256.57,cy:206.57,r:135},
   m:{cx:228.28,cy:93.43,r:45}, s1:{cx:256.57,cy:178.28,r:0}, s2:{cx:200,cy:234.85,r:90} }}

  };
const THEMES = ['Pessoas','Animais','Objetos','Transporte','Formas Geométricas','Números','Alfabeto','Todos'];
const THEME_EMOJI = {Pessoas:'🧍',Animais:'🐾',Objetos:'🏠',Transporte:'🚗','Formas Geométricas':'🔷',Números:'🔢',Alfabeto:'🔠',Todos:'🌈'};
const LEVELS = {facil:{label:'Fácil',memo:60,mult:1},medio:{label:'Médio',memo:30,mult:2.5},avancado:{label:'Difícil',memo:15,mult:8}};
/* icones
LetraA:      { name:'Letra A', emoji:'🅰️' }
LetraB:      { name:'Letra B', emoji:'🅱️' }
LetraC:      { name:'Letra C', emoji:'🇨' } // ou ©️
LetraD:      { name:'Letra D', emoji:'🔤' }

Cachorro:    { name:'Cachorro', emoji:'🐶' }
Gato:        { name:'Gato', emoji:'🐱' }
Peixe:       { name:'Peixe', emoji:'🐟🐟' }

PessoaOrando:{ name:'Pessoa Orando', emoji:'🙏' }
Pessoa:      { name:'Pessoa', emoji:'🧍' }

Chines:      { name:'Chinês de Chapéu', emoji:'👲' }

Geisha:      { name:'Mulher Geisha', emoji:'👘' }

Carro:       { name:'Carro', emoji:'🚗' }
Aviao:       { name:'Avião', emoji:'✈️' }
Motocicleta: { name:'Motocicleta', emoji:'🏍️' }

Chave:       { name:'Chave', emoji:'🔑' }
Cadeira:     { name:'Cadeira', emoji:'🪑' }
Espada:      { name:'Espada', emoji:'⚔️' }

Camisa:      { name:'Camisa', emoji:'👕' }

Coracao:     { name:'Coração', emoji:'❤️' }

Piramide:    { name:'Pirâmide', emoji:'🔺' }

Esfera:      { name:'Esfera', emoji:'⚪' }
A → 🟥
B → 🟦
C → 🟩
D → 🟨
*/
/* ===================== ESTADO ===================== */
let state = {
  modo:1,
  nomes:['Jogador 1','Jogador 2'],
  avatars:[null,null],
  nivel:'facil',
  rounds:3,
  tema:'Objetos',

  round:0,
  turn:0,

  scores:[0,0],

  used:[],

  currentFigure:null,

  timer:null,
  remain:0,

  phase:'idle',

  roundPlayersFinished:[false,false]
};

/* ===================== HELPERS UI ===================== */
const $ = id => document.getElementById(id);
const showScreen = id => { document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active')); $(id).classList.add('active'); };
const openModal = id => $(id).classList.add('active');
const closeModal = id => $(id).classList.remove('active');
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>closeModal(b.dataset.close));
$('btnManual').onclick = ()=>openModal('modalManual');
$('btnManual2').onclick = ()=>openModal('modalManual');

function renderPlayersBar(){
  const box = $('playersBar'); box.innerHTML='';
  const n = state.modo;
  for(let i=0;i<n;i++){
    const el = document.createElement('div');
    el.className = 'pcard'+(state.phase==='play'&&state.turn===i?' turn':'');
    const av = state.avatars[i] ? `style="background-image:url(${state.avatars[i]})"` : '';
    el.innerHTML = `<div class="avatar" ${av}>${state.avatars[i]?'':'🙂'}</div>
      <div><div class="pname">${state.nomes[i]}</div><div class="pscore">🏆 ${state.scores[i]}</div></div>`;
    box.appendChild(el);
  }
}
renderPlayersBar();

/* ===================== TELA DE ABERTURA ===================== */
let splashDone=false;
function leaveSplash(){
  if(splashDone) return; splashDone=true;
  showScreen('screenSetup');
}
$('btnSplashStart').onclick = leaveSplash;
setTimeout(leaveSplash, 2600);

/* ===================== TELA SETUP ===================== */
$('modo1').onclick=()=>{state.modo=1;$('modo1').classList.add('sel');$('modo2').classList.remove('sel');$('p2box').style.display='none';renderPlayersBar();};
$('modo2').onclick=()=>{state.modo=2;$('modo2').classList.add('sel');$('modo1').classList.remove('sel');$('p2box').style.display='flex';renderPlayersBar();};
$('nome1').oninput=e=>{state.nomes[0]=e.target.value||'Jogador 1';renderPlayersBar();};
$('nome2').oninput=e=>{state.nomes[1]=e.target.value||'Jogador 2';renderPlayersBar();};
function bindAvatar(inputId,lblId,idx){
  $(inputId).onchange = e=>{
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      state.avatars[idx]=ev.target.result;
      const lbl=$(lblId);
      lbl.style.backgroundImage=`url(${ev.target.result})`;
      const emojiSpan = lbl.querySelector('.avatar-emoji');
      if(emojiSpan) emojiSpan.style.display='none';
      renderPlayersBar();
    };
    r.readAsDataURL(f);
  };
}
bindAvatar('avatar1','avatar1Lbl',0); bindAvatar('avatar2','avatar2Lbl',1);

const lvlBox = $('levelCards');
Object.entries(LEVELS).forEach(([k,v])=>{
  const d=document.createElement('div'); d.className='lvlcard'+(k==='facil'?' sel':'');
  d.innerHTML=`<b>${v.label}</b><span>${v.memo}s p/ memorizar</span>`;
  d.onclick=()=>{state.nivel=k;[...lvlBox.children].forEach(c=>c.classList.remove('sel'));d.classList.add('sel');};
  lvlBox.appendChild(d);
});
const roundBox = $('roundSel');
[1,2,3,4].forEach(n=>{
  const b=document.createElement('button'); b.textContent=n; if(n===3)b.classList.add('sel');
  b.onclick=()=>{state.rounds=n;[...roundBox.children].forEach(c=>c.classList.remove('sel'));b.classList.add('sel');};
  roundBox.appendChild(b);
});
const themeBox = $('themeGrid');
THEMES.forEach(t=>{
  const b=document.createElement('button'); b.className='themebtn'+(t==='Objetos'?' sel':'');
  b.innerHTML=`<span>${THEME_EMOJI[t]}</span><span>${t}</span>`;
  b.onclick=()=>{state.tema=t;[...themeBox.children].forEach(c=>c.classList.remove('sel'));b.classList.add('sel');};
  themeBox.appendChild(b);
});

/* --- Aparência das peças (monocromático) --- */
const monoGrid=$('monoGrid');
MONO_COLORS.forEach(c=>{
  const b=document.createElement('button'); b.className='monoBtn'+(c.hex===MONO.color?' sel':'');
  b.innerHTML=`<span class="sw" style="background:${c.fill||c.hex}"></span><span>${c.name}</span>`;
  b.onclick=()=>{
    MONO.color=c.hex; MONO.fill=c.fill||null;
    [...monoGrid.children].forEach(x=>x.classList.remove('sel')); b.classList.add('sel');
    applyMonoTheme();
  };
  monoGrid.appendChild(b);
});
$('chkMono').onchange=e=>{
  MONO.on=e.target.checked;
  $('monoBox').classList.toggle('hidden',!MONO.on);
  applyMonoTheme();   // desmarcar restaura automaticamente as cores originais
};

$('btnStart').onclick=()=>{

  state.round=0;
  state.turn=0;

  state.scores=[0,0];

  state.used=[];

  state.phase='play';

  state.roundPlayersFinished=[false,false];

  showScreen('screenGame');

  nextRound();

};

/* ===================== MOTOR DO TABULEIRO (compartilhado jogo + criativo) ===================== */
function pickFigure(theme, usedList){
  const pool = theme==='Todos' ? Object.keys(FIGURES) : Object.keys(FIGURES).filter(k=>FIGURES[k].themes.includes(theme));
  let avail = pool.filter(k=>!usedList.includes(k));
  if(avail.length===0){ usedList.length=0; avail = pool; }
  const pick = avail[Math.floor(Math.random()*avail.length)];
  usedList.push(pick);
  return pick;
}
function scale(px){ return px; } // canvas fixo 320, escala via CSS transform no wrapper

function fitBoard(wrapId, boardId){

  const wrap=$(wrapId);
  const board=$(boardId);

  const k = wrap.clientWidth / 430;

  board.style.transform = `scale(${k})`;

}
window.addEventListener('resize',()=>{ fitBoard('boardWrap','board320'); fitBoard('creativeBoardWrap','creativeBoard320'); });

function pieceEl(id, big){
  const d=document.createElement('div'); d.className='piece'; d.dataset.id=id;
  const p=PIECES[id];
  d.style.width=p.w+'px'; d.style.height=p.h+'px'; d.style.background=pieceColor(id);
  d.style.clipPath=CLIP[p.shape];
  return d;
}
function applyRT(el){
  const rot = el.dataset.rot||0, fx = el.dataset.flipx||1, fy = el.dataset.flipy||1;
  el.style.transform = `rotate(${rot}deg) scaleX(${fx}) scaleY(${fy})`;
}
function setTransform(el,cx,cy,rot){
  const w=el.offsetWidth||parseFloat(el.style.width), h=el.offsetHeight||parseFloat(el.style.height);
  el.style.left=(cx-w/2)+'px'; el.style.top=(cy-h/2)+'px';
  el.dataset.rot=rot;
  if(el.dataset.flipx===undefined) el.dataset.flipx=1;
  if(el.dataset.flipy===undefined) el.dataset.flipy=1;
  applyRT(el);
}

/* --- Fase de memorização --- */
function showFigurePreview(container, figId, colorful){
  container.innerHTML='';
  const inner=document.createElement('div'); inner.style.position='relative'; inner.style.width='430px'; inner.style.height='430px';
  inner.style.transformOrigin='top left';
  const fig=FIGURES[figId];
  const sh=figShift(figId);
  Object.entries(fig.p).forEach(([pid,t])=>{
    const el=pieceEl(pid); if(!colorful) el.style.background='#8CA0C4';
    inner.appendChild(el); setTransform(el,t.cx+sh.dx,t.cy+sh.dy,t.r);
  });
  container.appendChild(inner);
  const k = container.clientWidth/430; inner.style.transform=`scale(${k})`;
}

/* --- Contador regressivo --- */
function startCountdown(seconds, onTick, onDone){
  clearInterval(state.timer);
  state.remain = seconds; onTick(state.remain,seconds);
  state.timer = setInterval(()=>{
    state.remain -= 0.1;
    if(state.remain<=0){ clearInterval(state.timer); onTick(0,seconds); onDone(); }
    else onTick(state.remain,seconds);
  },100);
}

/* --- Drag & Drop (Pointer Events, mouse+toque) --- */
let dragCtx=null, lastTap={id:null,t:0};
let selectedPieceEl=null;
function selectPiece(el){
  if(selectedPieceEl) selectedPieceEl.classList.remove('selected');
  selectedPieceEl=el; el.classList.add('selected');
  updateFlipHints();
}
function updateFlipHints(){
  const label = selectedPieceEl ? `✅ Peça selecionada — gire (⟲ ⟳ 45°) ou inverta` : '👆 Toque numa peça para selecioná-la';
  const h1=document.getElementById('flipHint'), h2=document.getElementById('flipHintC');
  if(h1) h1.textContent=label;
  if(h2) h2.textContent=label;
}


/* Início de arrasto (usado pela própria peça e pela área de toque ao redor dela) */
function startDrag(el, e, wrap){
  if(el.dataset.locked) return;               // peça já encaixada: não mexe mais
  const rect=wrap.getBoundingClientRect(); const k=wrap.clientWidth/430;
  dragCtx={ el, board:wrap, k, sx:e.clientX, sy:e.clientY, moved:false,
    offX:(e.clientX-rect.left)/k - parseFloat(el.style.left),
    offY:(e.clientY-rect.top)/k - parseFloat(el.style.top) };
  el.classList.add('dragging');
  try{ el.setPointerCapture(e.pointerId); }catch(_){}
  selectPiece(el);
}
function enableDrag(el, wrap){
  el.addEventListener('pointerdown', e=>{ e.preventDefault(); e.stopPropagation(); startDrag(el,e,wrap); });
  // Toque duplo (sem arrastar) = gira 45°. Sem 'dblclick': ele somava outro giro e pulava 90°.
  el.addEventListener('pointerup', ()=>{
    if(el.dataset.locked || !dragCtx || dragCtx.moved){ lastTap={id:null,t:0}; return; }
    const now=Date.now();
    if(lastTap.id===el && now-lastTap.t<350){ rotateEl(el,45); lastTap={id:null,t:0}; }
    else lastTap={id:el,t:now};
  });
}
function rotateEl(el, delta){
  if(!el || el.dataset.locked) return;
  el.dataset.rot=(((parseInt(el.dataset.rot||0)+delta)%360)+360)%360;
  applyRT(el);
  el.dispatchEvent(new CustomEvent('piecemoved'));
}
function rotateSelected(d){ if(!selectedPieceEl){ updateFlipHints(); return; } rotateEl(selectedPieceEl,d); }
function flipSelected(axis){
  if(!selectedPieceEl || selectedPieceEl.dataset.locked){ updateFlipHints(); return; }
  const key = axis==='x' ? 'flipx' : 'flipy';
  selectedPieceEl.dataset[key] = (parseInt(selectedPieceEl.dataset[key]||1) * -1);
  applyRT(selectedPieceEl);
  selectedPieceEl.dispatchEvent(new CustomEvent('piecemoved'));
}
$('btnFlipH').onclick=()=>flipSelected('x');
$('btnFlipV').onclick=()=>flipSelected('y');
$('btnFlipHC').onclick=()=>flipSelected('x');
$('btnFlipVC').onclick=()=>flipSelected('y');
[['btnRotL',-45],['btnRotR',45],['btnRotLC',-45],['btnRotRC',45]].forEach(([id,d])=>{ $(id).onclick=()=>rotateSelected(d); });

window.addEventListener('pointermove', e=>{
  if(!dragCtx) return;
  if(!dragCtx.moved && Math.hypot(e.clientX-dragCtx.sx, e.clientY-dragCtx.sy)>6) dragCtx.moved=true;
  const rect=dragCtx.board.getBoundingClientRect();
  let x=(e.clientX-rect.left)/dragCtx.k - dragCtx.offX;
  let y=(e.clientY-rect.top)/dragCtx.k - dragCtx.offY;
  const w=parseFloat(dragCtx.el.style.width), h=parseFloat(dragCtx.el.style.height);
  x = Math.max(0, Math.min(430-w, x));
  y = Math.max(0, Math.min(530-h, y));
  dragCtx.el.style.left=x+'px'; dragCtx.el.style.top=y+'px';
});
function endDrag(){
  if(!dragCtx) return;
  const el=dragCtx.el; dragCtx=null;
  el.classList.remove('dragging');
  el.dispatchEvent(new CustomEvent('piecemoved'));
}
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);
// a tela não rola enquanto uma peça é arrastada (iOS/Android)
document.addEventListener('touchmove', e=>{ if(dragCtx) e.preventDefault(); },{passive:false});

/* Conferência pela FORMA REAL: compara os vértices da peça (com giro e inversão aplicados) com os do alvo.
   Assim qualquer encaixe que forme a mesma imagem vale: quadrado a cada 90°, paralelogramo a cada 180°,
   e triângulo invertido (espelhado) equivale a um giro de ±90°. Paralelogramo espelhado nunca vale. */
function shapePts(id){
  const p=PIECES[id];
  return CLIP[p.shape].replace(/polygon\(|\)/g,'').split(',').map(v=>{
    const q=v.trim().split(/\s+/).map(n=>parseFloat(n)/100);
    return [(q[0]-.5)*p.w,(q[1]-.5)*p.h];
  });
}
function visualPts(id, rot, fx, fy){
  const a=rot*Math.PI/180, co=Math.cos(a), si=Math.sin(a);
  return shapePts(id).map(([x,y])=>{ x*=fx; y*=fy; return [x*co-y*si, x*si+y*co]; });
}
function sameShape(A,B,tol){
  const near=(P,Q)=>P.every(a=>Q.some(b=>Math.hypot(a[0]-b[0],a[1]-b[1])<tol));
  return A.length===B.length && near(A,B) && near(B,A);
}
/* Centraliza cada figura: desloca todas as peças alvo para que o retângulo da figura fique no centro do canvas.
   O mesmo deslocamento vale para a pré-visualização, a marca d'água e o encaixe. */
const _shift={};
function figShift(figId){
  if(_shift[figId]) return _shift[figId];
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  Object.entries(FIGURES[figId].p).forEach(([id,t])=>{
    visualPts(id,t.r,1,1).forEach(([x,y])=>{
      x0=Math.min(x0,t.cx+x); x1=Math.max(x1,t.cx+x); y0=Math.min(y0,t.cy+y); y1=Math.max(y1,t.cy+y);
    });
  });
  return _shift[figId]={dx:215-(x0+x1)/2, dy:215-(y0+y1)/2};
}
// alvo da peça no tabuleiro (só centraliza na horizontal: embaixo fica a bandeja de peças)
function targetOf(figId,pid){ const t=FIGURES[figId].p[pid], s=figShift(figId); return {cx:t.cx+s.dx, cy:t.cy, r:t.r}; }
function pieceMatch(el, t){
  const c=centerOf(el), pid=el.dataset.id;
  const fx=parseInt(el.dataset.flipx||1), fy=parseInt(el.dataset.flipy||1);
  return {
    posOk: Math.abs(c.cx-t.cx)<POS_TOL && Math.abs(c.cy-t.cy)<POS_TOL,
    rotOk: sameShape(visualPts(pid,c.r,fx,fy), visualPts(pid,t.r,1,1), 3)
  };
}
/* Encaixa e TRAVA a peça se ângulo e lugar estiverem certos: não sai mais até o fim do jogo */
/* Modo monocromático: L1/L2 e S1/S2 têm o mesmo tamanho e a mesma cor, então uma pode ocupar a vaga da outra */
const MONO_TWINS = {l1:'l2', l2:'l1', s1:'s2', s2:'s1'};
function slotCandidates(pid){ return (MONO.on && MONO_TWINS[pid]) ? [pid, MONO_TWINS[pid]] : [pid]; }
function tryLock(el, figId){
  if(el.dataset.locked) return true;
  const board=el.parentElement;
  for(const slot of slotCandidates(el.dataset.id)){
    if(board.querySelector(`.piece[data-slot="${slot}"]`)) continue;   // vaga já ocupada
    const t=targetOf(figId,slot), m=pieceMatch(el,t);
    if(!(m.posOk && m.rotOk)) continue;
    el.dataset.flipx=1; el.dataset.flipy=1;
    setTransform(el,t.cx,t.cy,t.r);
    el.dataset.locked='1'; el.dataset.slot=slot;
    el.classList.remove('dragging','selected'); el.classList.add('locked');
    if(selectedPieceEl===el){ selectedPieceEl=null; updateFlipHints(); }
    return true;
  }
  return false;
}
/* Área de toque ampliada: tocar perto de uma peça também a agarra */
function enableGrabAssist(wrap){
  if(wrap._grab) return; wrap._grab=true;
  wrap.addEventListener('pointerdown', e=>{
    if(e.target.closest('.piece')) return;
    const rect=wrap.getBoundingClientRect(), k=wrap.clientWidth/430;
    let best=null, bd=34;
    wrap.querySelectorAll('.piece:not(.locked)').forEach(p=>{
      const c=centerOf(p), d=Math.hypot((e.clientX-rect.left)/k-c.cx,(e.clientY-rect.top)/k-c.cy);
      if(d<bd){ bd=d; best=p; }
    });
    if(best){ e.preventDefault(); startDrag(best,e,wrap); }
  });
}

/* --- Espalha as 7 peças na bandeja (parte inferior do canvas 430x530) --- */
const TRAY_POS = {

  l1:{cx:98,cy:373},
  l2:{cx:232,cy:373},
  m:{cx:348,cy:373},

  pa:{cx:100,cy:478},
  sq:{cx:208,cy:478},
  s1:{cx:285,cy:478},
  s2:{cx:362,cy:478}

};


function scatterPieces(board, pieces){

  board.querySelectorAll('.piece').forEach(p=>p.remove());
  selectedPieceEl=null; updateFlipHints();

  enableGrabAssist(board.parentElement);

  pieces.forEach(pid=>{

    const el=pieceEl(pid);

    board.appendChild(el);

    const pos=TRAY_POS[pid];

    setTransform(
      el,
      pos.cx,
      pos.cy,
      Math.floor(Math.random()*8)*45
    );

    enableDrag(el, board.parentElement);

    el.addEventListener('piecemoved',()=>{
      const fig=FIGURES[state.currentFigure];
      if(!fig) return;
      tryLock(el, state.currentFigure);
      if(board.id!=='creativeBoard320' && checkComplete(board,state.currentFigure)) roundEnd(true);
    });

  });

}

/* --- Checagem de encaixe --- */
function centerOf(el){
  const w=parseFloat(el.style.width), h=parseFloat(el.style.height);
  return { cx: parseFloat(el.style.left)+w/2, cy: parseFloat(el.style.top)+h/2, r: parseInt(el.dataset.rot||0) };
}

function checkComplete(board, figId){
  return board.querySelectorAll('.piece[data-locked="1"]').length === 7;
}

function nextRound(){

  if(state.round >= state.rounds){
    return endGame();
  }

  state.round++;

  state.turn = 0;

  state.roundPlayersFinished=[false,false];

  state.currentFigure =
      pickFigure(state.tema,state.used);

  $('roundPill').textContent =
      `Rodada ${state.round}/${state.rounds}`;

  $('themePill').textContent =
      `${THEME_EMOJI[state.tema]} ${state.tema}`;

  updateScorePill();

  renderPlayersBar();

  startMemorizePhase();

}


function updateScorePill(){

  $('scorePill').textContent =
      `🎯 Vez de ${state.nomes[state.turn]} | 🏆 ${state.scores[state.turn]} pts`;

}

function startMemorizePhase(){
  $('stageMsg').textContent = '👀 Memorize a figura! O tempo está correndo...';
  $('figureView').classList.remove('hidden'); $('boardWrap').classList.add('hidden');
  $('btnCheck').classList.add('hidden'); $('btnRotateHint').classList.add('hidden');
  $('flipBar').classList.add('hidden');
  showFigurePreview($('figureView'), state.currentFigure, true);
  const lvl = LEVELS[state.nivel];
  const bar=$('progBar'); bar.classList.remove('warn');
  startCountdown(lvl.memo, (rem,total)=>{ bar.style.width=(rem/total*100)+'%'; if(rem/total<0.3) bar.classList.add('warn'); }, startAssemblyPhase);
}

function startAssemblyPhase(){
  $('figureView').classList.add('hidden');
  $('boardWrap').classList.remove('hidden');

  $('btnCheck').classList.remove('hidden');
  $('btnRotateHint').classList.remove('hidden');
  $('flipBar').classList.remove('hidden');

  $('stageMsg').textContent = '🧩 Monte a figura de memória!';

  fitBoard('boardWrap','board320');

  const board = $('board320');

  board.innerHTML='';

  showGhostGuide(board, state.currentFigure);

  scatterPieces(board, Object.keys(PIECES));

  const lvl = LEVELS[state.nivel];
  const assembleTime = lvl.memo*2;

  const bar=$('progBar');
  bar.classList.remove('warn');

  startCountdown(
    assembleTime,
    (rem,total)=>{
      bar.style.width=(rem/total*100)+'%';
      if(rem/total<0.3) bar.classList.add('warn');
    },
    ()=>roundEnd(false)
  );

  $('btnCheck').onclick=()=>{
    if(checkComplete(board,state.currentFigure)){
      roundEnd(true);
    }else{
      $('stageMsg').textContent='Quase lá! Continue ajustando as peças 💪';
    }
  };
}


function showGhostGuide(board, figId){ //Marca dágua

  board.querySelectorAll('.ghost, .pieceGhost')
       .forEach(g => g.remove());

  const fig = FIGURES[figId];

  Object.entries(fig.p).forEach(([pid,t])=>{

      const g = pieceEl(pid);
      const cor = pieceColor(pid);

      g.className = 'pieceGhost';
      g.dataset.id = pid;

      // Preenchimento com a cor real da peça, em opacidade moderada — dá uma
      // "dica de cor" e mostra o contorno exato (o clip-path já recorta a
      // forma certinha), sem revelar a figura por completo.
      g.style.background = cor;
      g.style.opacity = '0.32';

      board.appendChild(g);

      const T = targetOf(figId,pid);
      setTransform(g, T.cx, T.cy, T.r);

  });

}

function roundEnd(success){

  clearInterval(state.timer);

  if(success){

    const pts =
      Math.round(
        state.remain *
        LEVELS[state.nivel].mult
      );

    state.scores[state.turn]+=pts;

    $('resultTitle').textContent =
      '🎉 Muito bem!';

    $('resultText').textContent =
      `${state.nomes[state.turn]} montou a figura e ganhou ${pts} pontos!`;

  }else{

    $('resultTitle').textContent =
      '😊 Quase lá!';

    $('resultText').textContent =
      `${state.nomes[state.turn]} não conseguiu concluir a figura desta vez.`;

  }

  state.roundPlayersFinished[state.turn]=true;

  renderPlayersBar();

  openModal('modalResult');

}

$('btnNextRound').onclick=()=>{

  closeModal('modalResult');

  /*
   Modo 1 jogador
  */

  if(state.modo===1){

    nextRound();
    return;

  }

  /*
   Modo 2 jogadores
  */

  if(
      state.turn===0 &&
      !state.roundPlayersFinished[1]
  ){

      state.turn=1;

      updateScorePill();

      renderPlayersBar();

      startMemorizePhase();

      return;
  }

  /*
   Ambos jogaram
  */

  if(
      state.roundPlayersFinished[0] &&
      state.roundPlayersFinished[1]
  ){

      nextRound();
  }

};

/* Foto enviada pelo jogador (ou 🙂, se não enviou), em círculo */
function avatarBadge(idx,size,ring){
  const img=state.avatars[idx];
  const st=`width:${size}px;height:${size}px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;box-sizing:border-box;background-color:#EEF3FB;font-size:${Math.round(size*.6)}px;border:${ring?'4px solid #f59e0b':'2px solid #DCE7F9'};`
    +(img?`background-image:url('${img}');background-size:cover;background-position:center;`:'');
  return `<span style="${st}">${img?'':'🙂'}</span>`;
}

function endGame(){

  updateScorePill();
  renderPlayersBar();

  if(state.modo===1){
    $('endScores').innerHTML=`
      <h2 style="color:#f59e0b;font-size:2rem;margin-bottom:20px">🎉 Fim de jogo!</h2>
      <div style="display:flex;justify-content:center;margin-bottom:10px">${avatarBadge(0,72,true)}</div>
      <h3>${state.nomes[0]}</h3>
      <p>🏆 ${state.scores[0]} pontos no total</p>
    `;
    openModal('modalEnd');
    return;
  }

  let champion=0;

  if(state.scores[1] > state.scores[0]){
    champion=1;
  }

  const empate = state.scores[0]===state.scores[1];

  $('endScores').innerHTML=`

    <h2 style="
      color:#f59e0b;
      font-size:2rem;
      margin-bottom:20px">
      ${empate ? '🤝 Empate!' : '👑 Campeão'}
    </h2>

    ${empate ? '' : `
    <div style="display:flex;justify-content:center;margin-bottom:10px">
      ${avatarBadge(champion,84,true)}
    </div>

    <h3>
      ${state.nomes[champion]}
    </h3>

    <p>
      🏆 ${state.scores[champion]} pontos
    </p>
    `}

    <hr>

    <p style="display:flex;align-items:center;justify-content:center;gap:8px">
      ${avatarBadge(0,28)} ${state.nomes[0]} : ${state.scores[0]} pts
    </p>

    <p style="display:flex;align-items:center;justify-content:center;gap:8px">
      ${avatarBadge(1,28)} ${state.nomes[1]} : ${state.scores[1]} pts
    </p>
  `;

  openModal('modalEnd');

}
$('btnPlayAgain').onclick=()=>{ closeModal('modalEnd'); showScreen('screenSetup'); state.phase='idle'; renderPlayersBar(); };
$('btnExitGame').onclick=()=>{ clearInterval(state.timer); showScreen('screenSetup'); state.phase='idle'; renderPlayersBar(); };

/* ===================== MODO CRIATIVO ===================== */
const cGrid=$('creativeFigureGrid');
Object.entries(FIGURES).forEach(([id,f])=>{
  const b=document.createElement('button'); b.className='themebtn';
  b.innerHTML=`<span>${f.emoji}</span><span>${f.name}</span>`;
  b.onclick=()=>startCreative(id);
  cGrid.appendChild(b);
});
$('btnCreativeOpen').onclick=()=>{ showScreen('screenCreative'); $('creativeStage').classList.add('hidden'); };
$('btnCreativeHome').onclick=()=>{ showScreen('screenSetup'); };
$('btnExitCreative').onclick=()=>{

  $('creativeStage').classList.add('hidden');

  $('creativeBoard320').innerHTML='';

  $('checklistBar').classList.remove('hidden');

  showScreen('screenSetup');

};

/* --- Checklist do Modo Criativo: 1 item por peça (número + nome + cor),
     com 2 sub-itens (ângulo certo / lugar certo). O sistema marca
     automaticamente conforme a peça é girada/arrastada corretamente;
     o usuário também pode marcar/desmarcar manualmente se quiser. --- */
const CHECK_ORDER = ['l1','l2','m','s1','s2','sq','pa'];
const ROT_TOL = 25, POS_TOL = 26;

function buildChecklistHTML(){
  return CHECK_ORDER.map((pid,i)=>{
    const info = PIECE_INFO[pid];
    return `<div class="check-item" data-pid="${pid}">
      <label class="check-main">
        <input type="checkbox" class="chk-parent" disabled>
        <span>${i+1}. ${info.label}${MONO.on ? '' : ` (cor ${info.colorName})`}:</span>
      </label>
      <label class="check-sub">
        <input type="checkbox" class="chk-rot" data-pid="${pid}"> Posição certa (ângulo).
      </label>
      <label class="check-sub">
        <input type="checkbox" class="chk-pos" data-pid="${pid}"> Lugar certo (imagem).
      </label>
    </div>`;
  }).join('');
}

function updateChecklistItem(pid, rotOk, posOk){
  const item = document.querySelector(`#checklist .check-item[data-pid="${pid}"]`);
  if(!item) return;
  item.querySelector('.chk-rot').checked = rotOk;
  item.querySelector('.chk-pos').checked = posOk;
  item.querySelector('.chk-parent').checked = rotOk && posOk;
  item.classList.toggle('complete', rotOk && posOk);
}

function checklistStatusFor(el, target){
  const m=pieceMatch(el,target);
  return { rotOk:m.rotOk, posOk:m.posOk };
}

// Confere as 7 peças de uma vez (usado ao abrir a figura, pra já marcar
// automaticamente quem por acaso já nasceu no lugar/ângulo certo).
/* Status de uma vaga: no modo monocromático vale a melhor peça entre as gêmeas */
function slotStatus(board, figId, pid){
  const t=targetOf(figId,pid); let best={rotOk:false,posOk:false}, bs=-1;
  slotCandidates(pid).forEach(id=>{
    board.querySelectorAll(`.piece[data-id="${id}"]`).forEach(el=>{
      if(el.dataset.locked && el.dataset.slot!==pid) return;   // já encaixada em outra vaga
      const m=pieceMatch(el,t), sc=(m.rotOk?1:0)+(m.posOk?1:0);
      if(sc>bs){ bs=sc; best={rotOk:m.rotOk,posOk:m.posOk}; }
    });
  });
  return best;
}
function refreshChecklistAll(board, figId){
  CHECK_ORDER.forEach(pid=>{ const st=slotStatus(board,figId,pid); updateChecklistItem(pid,st.rotOk,st.posOk); });
  updateChecklistProgress();
}

function updateChecklistProgress(){
  const total = CHECK_ORDER.length;
  const done = document.querySelectorAll('#checklist .check-item.complete').length;
  $('checklistProgress').textContent = `(${done}/${total})`;
  if(done===total) $('creativeMsg').textContent = '🎉 Parabéns! Checklist completo — figura montada!';
}

// Permite ao usuário marcar/desmarcar manualmente também.
document.getElementById('checklist')?.addEventListener('change', e=>{
  if(!e.target.matches('.chk-rot,.chk-pos')) return;
  const item = e.target.closest('.check-item');
  const rotOk = item.querySelector('.chk-rot').checked;
  const posOk = item.querySelector('.chk-pos').checked;
  item.querySelector('.chk-parent').checked = rotOk && posOk;
  item.classList.toggle('complete', rotOk && posOk);
  updateChecklistProgress();
});

function startCreative(figId){

  $('creativeStage').classList.remove('hidden');

  fitBoard('creativeBoardWrap','creativeBoard320');

  const board=$('creativeBoard320');

  board.querySelectorAll('.piece,.pieceGhost')
       .forEach(p=>p.remove());

  showGhostGuide(board, figId);

  state.currentFigure=figId;
  scatterPieces(board,Object.keys(PIECES));

  $('creativeMsg').textContent =
      `Monte: ${FIGURES[figId].name} ${FIGURES[figId].emoji}`;

  $('checklist').innerHTML = buildChecklistHTML();
  $('checklistBar').classList.remove('hidden');

  // Confere de cara: pode ser que alguma peça já tenha nascido no
  // ângulo/lugar certo por acaso (sorteio inicial) — já marca no checklist.
  refreshChecklistAll(board, figId);

  board.querySelectorAll('.piece').forEach(el=>{

    el.addEventListener('piecemoved',()=>{

      refreshChecklistAll(board, figId);

      if(checkComplete(board,figId)){

        $('creativeMsg').textContent =
          '🎉 Parabéns! Figura montada com sucesso!';

      }

    });

  });

}

/* Ajusta escala dos tabuleiros ao trocar de tela / carregar */
new ResizeObserver(()=>{ fitBoard('boardWrap','board320'); fitBoard('creativeBoardWrap','creativeBoard320'); }).observe(document.body);
window.addEventListener('load',()=>{ fitBoard('boardWrap','board320'); fitBoard('creativeBoardWrap','creativeBoard320'); });

