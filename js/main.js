//Obrigado Senhor por me dá inteligência
//Obrigado Virgem Maria, por ser uma mãe tão boa para mim
const displayMain = document.querySelector('#display > #d-main');
const buttonStart = document.querySelector('.controls > #start');
const buttonPause = document.querySelector('.controls > #pause');
const buttonReset = document.querySelector('.controls > #reset');

buttonStart.onclick = start;
buttonPause.onclick = pause;
buttonReset.onclick = reset;

let reqAniFra; //armazena o requestAnimationFrame para ser cancelado mais tarde
let run = false;
let init = 0;
let ms = 0;
let pauseMs = 0;

loadFromLocalStorage();
if(run) start();

//funções do cronômetro
function start() {
	if(!run) {
		init = Date.now();
		pauseMs = ms;
		run = true;
	}
	else {
		ms = Date.now() - init + pauseMs;
	}
	saveInLocalStorage();
	update();
	cancelAnimationFrame(reqAniFra);
	reqAniFra = requestAnimationFrame(start);
}

function pause() {
	cancelAnimationFrame(reqAniFra);
	run = false;
	saveInLocalStorage();
}

function reset() {
	ms = 0;
	pause();
	saveInLocalStorage();
	update();
}

function saveInLocalStorage() {
    localStorage.setItem("savedRun", run);
    localStorage.setItem("savedInit", init);
    localStorage.setItem("savedMs", ms);
    localStorage.setItem("savedPauseMs", pauseMs);
}

function loadFromLocalStorage() {
    const savedRun = localStorage.getItem("savedRun");
    const savedInit = localStorage.getItem("savedInit");
    const savedMs = localStorage.getItem("savedMs");
    const savedPauseMs = localStorage.getItem("savedPauseMs");
    
    savedRun == "true" ? run = true : run = false;
    Number(savedInit) ? init = Number(savedInit) : 0;
    Number(savedMs) ? ms = Number(savedMs) : 0;
    Number(savedPauseMs) ? pausedMs = Number(savedPauseMs) : 0;
}

//atualizações da tela
function update() {
	displayMain.innerHTML = textDisplay(ms);
	resizeFontSize();
}

//converter ms para um texto no formato
//  H:min:s:ms
function textDisplay(ms) {
	//converter ms nas outras medidas
	const h = Math.trunc(ms / 3600000); 
	let min = (Math.trunc(ms / 60000)) % 60;
	let s = (Math.trunc(ms / 1000)) % 60;
	let mspor10 = (Math.trunc(ms / 10)) % 100;
	//formatando texto
	min = min.toString(10);
	s = s.toString(10);
	mspor10 = mspor10.toString(10);
	if(min.length == 1) {
		min = '0' + min;
	}
	if(s.length == 1) {
		s = '0' + s;
	}
	if(mspor10.length == 1) {
		mspor10 = '0' + mspor10;
	}
	
	//Decidindo forma de exibição
	if(ms < 60000) {
		return s + '<small>s</small>.' + mspor10;
	}
	else if(ms < 60 * 60000) {
		return min + '<small>min</small>:' + s + '<small>s</small>.' + mspor10;
	}
	else {
		return h + '<small>H</small>:' + min + '<small>min</small>:' + s + '<small>s</small>.' + mspor10;
	}
}

function resizeFontSize() {
    const boxWidth = document.querySelector("#display").clientWidth;
    const length = displayMain.textContent.length;
    const fontSize =  `${boxWidth / length * 1.75}px`;
    displayMain.style.setProperty("--font-size", fontSize);
}

//iniciar cronometro com o visor
update();

//Alterna os botões de start e pause
//e habilitar ou desabilitar
function toggleBtnsObserver() {
    buttonStart.classList.toggle("hide", run)
    buttonPause.classList.toggle("hide", !run);
    
    if(run || ms == 0) buttonReset.setAttribute("disabled", "");
    else buttonReset.removeAttribute("disabled");
    requestAnimationFrame(toggleBtnsObserver);
}
toggleBtnsObserver();