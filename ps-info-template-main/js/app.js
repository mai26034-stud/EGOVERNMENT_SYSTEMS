let currentQuestionId = 1;

function getQuestionById(id) {
  return questionsData.questions.find(q => q.id === id);
}

function renderQuestion() {
  const q = getQuestionById(currentQuestionId);

  const container = document.querySelector(".question-container");

  container.innerHTML = `
    <h2>${q.question_text}</h2>
    ${q.options.map(opt => `
      <button onclick="selectOption(${opt.id})">
        ${opt.option_text}
      </button>
    `).join("")}
  `;
}

function selectOption(optionId) {
  const q = getQuestionById(currentQuestionId);
  const option = q.options.find(o => o.id === optionId);

  const container = document.querySelector(".question-container");

  // 🔹 Δικαιολογητικά
  let evidencesHtml = "";
  if (option.evidences) {
    evidencesHtml = `
      <h3>Απαιτούμενα Δικαιολογητικά:</h3>
      <ul>
        ${option.evidences.map(e => `<li>${e.required_evidence}</li>`).join("")}
      </ul>
    `;
  }

  //  Αν τερματίζει
  if (option.terminate) {
    container.innerHTML = `
      <h2>Η διαδικασία ολοκληρώθηκε</h2>
      <p>${option.termination_reason || ""}</p>
      ${evidencesHtml}
    `;
    return;
  }

  // 🔹 Αν συνεχίζει
  if (option.next_step) {
    currentQuestionId = option.next_step;
    renderQuestion();

    // δείξε και τα δικαιολογητικά
    if (option.evidences) {
      const container = document.querySelector(".question-container");
      container.innerHTML += evidencesHtml;
    }
  }
}

// ξεκινάει όταν πατήσεις "Ας ξεκινήσουμε"
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("intro").style.display = "none";
  renderQuestion();
});