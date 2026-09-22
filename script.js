const questions = [
  {
    q: "¿Nuestra fecha de aniversario 🙂?",
    a: ["14 de abril", "14 de marzo", "14 de septiembre", "La fecha correcta XD"],
    correct: 1
  },
  {
    q: "¿Nuestra posición favorita 😈?",
    a: ["Delantero", "Arquero", "De 4", "Volante mixto"],
    correct: 2
  },
  {
    q: "¿Mi pasatiempo favorito😴?",
    a: ["Dormir", "Besarte", "Jugar", "Comer"],
    correct: 0
  }
];

const $ = s => document.querySelector(s);
const modalBackdrop = $("#modalBackdrop");
const modal = $("#quizModal");
const question = $("#question");
const answers = $("#answers");
const feedback = $("#feedback");
const counter = $("#counter");
const hangman = $("#hangman");

let current = 0;
let errors = 0;
let locked = false;

function openQuiz(){
  current = 0;
  errors = 0;
  locked = false;
  $("#intro").classList.add("hidden");
  $("#failure").classList.add("hidden");
  $("#success").classList.add("hidden");
  hangman.dataset.errors = "0";
  modalBackdrop.classList.remove("hidden");
  renderQuestion();
}

function renderQuestion(){
  const item = questions[current];
  counter.textContent = `Pregunta ${current + 1} de ${questions.length}`;
  question.textContent = item.q;
  answers.innerHTML = "";
  feedback.textContent = "";
  item.a.forEach((text,i)=>{
    const btn = document.createElement("button");
    btn.className = "answer";
    btn.textContent = `${String.fromCharCode(65+i)}) ${text}`;
    btn.onclick = () => choose(i);
    answers.appendChild(btn);
  });
}

function choose(index){
  if(locked) return;
  locked = true;
  const item = questions[current];
  const buttons = [...document.querySelectorAll(".answer")];
  buttons.forEach(b => b.disabled = true);

  if(index === item.correct){
    modal.classList.remove("wrong");
    void modal.offsetWidth;
    modal.classList.add("correct");
    feedback.textContent = "¡Correcto! ✨";
    feedback.style.color = "#55ff9a";
    buttons[index].style.borderColor = "#25df73";

    setTimeout(()=>{
      modal.classList.remove("correct");
      current++;
      if(current >= questions.length){
        finishSuccess();
      }else{
        locked = false;
        renderQuestion();
      }
    }, 900);
  }else{
    errors++;
    modal.classList.remove("correct");
    void modal.offsetWidth;
    modal.classList.add("wrong");
    feedback.textContent = "¡Incorrecto! 😿";
    feedback.style.color = "#ff5555";
    buttons[index].style.borderColor = "#ff3d3d";
    hangman.dataset.errors = String(errors);

    setTimeout(()=>{
      modal.classList.remove("wrong");
      if(errors >= 3){
        finishFailure();
      }else{
        locked = false;
        renderQuestion();
      }
    }, 650);
  }
}

function finishFailure(){
  modalBackdrop.classList.add("hidden");
  $("#failure").classList.remove("hidden");
}

function finishSuccess(){
  modalBackdrop.classList.add("hidden");
  $("#success").classList.remove("hidden");
  launchCelebration();
}

$("#catButton").addEventListener("click", openQuiz);
$("#retry").addEventListener("click", ()=>{
  $("#failure").classList.add("hidden");
  $("#intro").classList.remove("hidden");
});
$("#closeModal").addEventListener("click", ()=>{
  modalBackdrop.classList.add("hidden");
  $("#intro").classList.remove("hidden");
});

modalBackdrop.addEventListener("click", e=>{
  if(e.target === modalBackdrop) {
    modalBackdrop.classList.add("hidden");
    $("#intro").classList.remove("hidden");
  }
});

function launchCelebration(){
  const canvas = $("#celebration");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize(){
    const dpr = Math.min(devicePixelRatio || 1,2);
    canvas.width = innerWidth*dpr;
    canvas.height = innerHeight*dpr;
    canvas.style.width = innerWidth+"px";
    canvas.style.height = innerHeight+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  resize();
  addEventListener("resize",resize);

  function burst(x,y){
    for(let i=0;i<65;i++){
      const angle = Math.random()*Math.PI*2;
      const speed = 2 + Math.random()*5;
      particles.push({
        x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,
        life:1,size:2+Math.random()*4,
        char:Math.random()>.55 ? "✦" : "•"
      });
    }
  }

  let lastBurst=0;
  function animate(t){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    if(t-lastBurst>700){
      burst(innerWidth*(.15+.7*Math.random()), innerHeight*(.18+.55*Math.random()));
      lastBurst=t;
    }
    particles = particles.filter(p=>p.life>0);
    for(const p of particles){
      p.x += p.vx;
      p.y += p.vy;
      p.vy += .035;
      p.life -= .012;
      ctx.globalAlpha=Math.max(0,p.life);
      ctx.font=`${p.size*5}px serif`;
      ctx.fillText(p.char,p.x,p.y);
    }
    ctx.globalAlpha=1;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}
