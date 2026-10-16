
"use strict";

/* ========================================
   ENGLISH LEARNING COACH
   Main application logic
   ======================================== */

const STORAGE_KEY = "englishCoachProgressV1";

const defaultProgress = {
  completedLessons: [],
  learnedWords: [],
  quizCorrect: 0,
  quizTotal: 0,
  writing: "",
  challengeDone: false
};

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || typeof saved !== "object") return { ...defaultProgress };

    return {
      ...defaultProgress,
      ...saved,
      completedLessons: Array.isArray(saved.completedLessons)
        ? saved.completedLessons : [],
      learnedWords: Array.isArray(saved.learnedWords)
        ? saved.learnedWords : [],
      quizCorrect: Number(saved.quizCorrect) || 0,
      quizTotal: Number(saved.quizTotal) || 0
    };
  } catch {
    return { ...defaultProgress };
  }
}

let progress = loadProgress();

function saveProgress() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    updateDashboard();
  } catch {
    showToast("Could not save progress. Check browser storage.");
  }
}

/* ---------- LESSON DATA ---------- */

const lessons = [
  {
    id: 1,
    title: "Basic sentence structure",
    category: "Grammar basics",
    level: "Beginner",
    description: "Learn how to make simple English sentences.",
    explanation: "A basic English sentence often follows Subject + Verb + Object. The subject tells us who or what the sentence is about. The verb describes an action or state. The object may receive the action.",
    example: "I read a book.",
    translation: "میں ایک کتاب پڑھتی ہوں۔",
    points: [
      "Subject: I",
      "Verb: read",
      "Object: a book",
      "Another example: She likes tea."
    ]
  },
  {
    id: 2,
    title: "Present simple tense",
    category: "Tenses",
    level: "Beginner",
    description: "Talk about habits, routines, and facts.",
    explanation: "Use the present simple for habits, routines, and general facts. With he, she, and it, a regular main verb usually takes -s or -es in positive statements.",
    example: "I study English. She studies English.",
    translation: "میں انگریزی پڑھتی ہوں۔ وہ انگریزی پڑھتی ہے۔",
    points: [
      "I/You/We/They + base verb",
      "He/She/It + verb-s or verb-es",
      "Negative: I do not play.",
      "Question: Do you play?"
    ]
  },
  {
    id: 3,
    title: "Am, is, and are",
    category: "Grammar basics",
    level: "Beginner",
    description: "Choose the correct form of the verb 'be'.",
    explanation: "Use am with I, is with he/she/it and singular subjects, and are with you/we/they and plural subjects.",
    example: "I am happy. She is ready. They are students.",
    translation: "میں خوش ہوں۔ وہ تیار ہے۔ وہ طالب علم ہیں۔",
    points: [
      "I am a student.",
      "He is my friend.",
      "You are welcome.",
      "We are ready."
    ]
  },
  {
    id: 4,
    title: "Articles: a, an, the",
    category: "Grammar basics",
    level: "Beginner",
    description: "Use English articles in everyday sentences.",
    explanation: "Use a before a singular countable noun beginning with a consonant sound. Use an before a vowel sound. Use the when the listener knows which specific person or thing you mean.",
    example: "A book, an apple, the sun.",
    translation: "ایک کتاب، ایک سیب، سورج۔",
    points: [
      "a university (starts with a /y/ sound)",
      "an hour (starts with a vowel sound)",
      "the door (a specific door)",
      "Article choice depends on sound and context."
    ]
  },
  {
    id: 5,
    title: "Past simple tense",
    category: "Tenses",
    level: "Beginner",
    description: "Describe completed actions in the past.",
    explanation: "Use the past simple for completed past actions. Regular verbs often take -ed. Irregular verbs have their own past forms.",
    example: "I visited my friend yesterday.",
    translation: "میں نے کل اپنے دوست سے ملاقات کی۔",
    points: [
      "Regular: work → worked",
      "Irregular: go → went",
      "Negative: I did not go.",
      "Question: Did you go?"
    ]
  },
  {
    id: 6,
    title: "Prepositions of place",
    category: "Grammar basics",
    level: "Beginner",
    description: "Describe where objects and people are.",
    explanation: "Prepositions describe relationships between people, objects, and places. In, on, and under are common prepositions of place.",
    example: "The book is on the table.",
    translation: "کتاب میز پر ہے۔",
    points: [
      "In: The keys are in the bag.",
      "On: The cup is on the table.",
      "Under: The cat is under the chair.",
      "Behind: The school is behind the park."
    ]
  }
];

/* ---------- VOCABULARY DATA ---------- */

const words = [
  { id: 1, word: "Confident", urdu: "پراعتماد", category: "Feelings", example: "I feel confident when I practice." },
  { id: 2, word: "Happy", urdu: "خوش", category: "Feelings", example: "I am happy today." },
  { id: 3, word: "Nervous", urdu: "گھبرایا ہوا", category: "Feelings", example: "I feel nervous before an exam." },
  { id: 4, word: "Beautiful", urdu: "خوبصورت", category: "Daily life", example: "This is a beautiful garden." },
  { id: 5, word: "Improve", urdu: "بہتر بنانا", category: "Study", example: "I want to improve my English." },
  { id: 6, word: "Knowledge", urdu: "علم", category: "Study", example: "Reading increases our knowledge." },
  { id: 7, word: "Practice", urdu: "مشق", category: "Study", example: "Practice helps me learn." },
  { id: 8, word: "Achieve", urdu: "حاصل کرنا", category: "Actions", example: "I want to achieve my goals." },
  { id: 9, word: "Helpful", urdu: "مددگار", category: "Daily life", example: "My teacher is very helpful." },
  { id: 10, word: "Remember", urdu: "یاد رکھنا", category: "Actions", example: "Please remember this word." },
  { id: 11, word: "Discover", urdu: "دریافت کرنا", category: "Actions", example: "I discover new words every day." },
  { id: 12, word: "Patient", urdu: "صبر کرنے والا", category: "Feelings", example: "Be patient while learning." },
  { id: 13, word: "Honest", urdu: "ایماندار", category: "Daily life", example: "An honest person tells the truth." },
  { id: 14, word: "Explain", urdu: "وضاحت کرنا", category: "Study", example: "Please explain this rule." },
  { id: 15, word: "Decide", urdu: "فیصلہ کرنا", category: "Actions", example: "I will decide tomorrow." },
  { id: 16, word: "Journey", urdu: "سفر", category: "Daily life", example: "Learning English is a journey." },
  { id: 17, word: "Friendly", urdu: "دوستانہ", category: "Feelings", example: "Our new classmate is friendly." },
  { id: 18, word: "Prepare", urdu: "تیاری کرنا", category: "Study", example: "I prepare for my exam." }
];

/* ---------- QUIZ DATA ---------- */

const questions = [
  {
    question: "Choose the correct sentence.",
    options: ["She are happy.", "She is happy.", "She am happy.", "She be happy."],
    answer: 1,
    explanation: "Use 'is' with she."
  },
  {
    question: "He _____ to school every day.",
    options: ["go", "going", "goes", "gone"],
    answer: 2,
    explanation: "In the present simple, use 'goes' with he."
  },
  {
    question: "I ate _____ apple.",
    options: ["a", "an", "the", "no article in every case"],
    answer: 1,
    explanation: "Use 'an' before a vowel sound in 'apple'."
  },
  {
    question: "What is the past tense of 'go'?",
    options: ["Goed", "Going", "Goes", "Went"],
    answer: 3,
    explanation: "'Went' is the irregular past form of 'go'."
  },
  {
    question: "The book is _____ the table.",
    options: ["on", "at", "between", "from"],
    answer: 0,
    explanation: "'On' describes something resting on a surface."
  },
  {
    question: "Choose the correct negative sentence.",
    options: ["He don't like tea.", "He doesn't likes tea.", "He doesn't like tea.", "He not like tea."],
    answer: 2,
    explanation: "Use doesn't + the base form of the verb."
  },
  {
    question: "They _____ students.",
    options: ["is", "am", "are", "be"],
    answer: 2,
    explanation: "Use 'are' with they."
  },
  {
    question: "Choose the correct question.",
    options: ["You do like English?", "Do you like English?", "Does you like English?", "Are you like English?"],
    answer: 1,
    explanation: "Use 'Do' before you in this present simple question."
  },
  {
    question: "What is the opposite of 'happy'?",
    options: ["Kind", "Tall", "Sad", "Fast"],
    answer: 2,
    explanation: "'Sad' is an opposite of 'happy'."
  },
  {
    question: "We _____ dinner yesterday.",
    options: ["eat", "eats", "eaten", "ate"],
    answer: 3,
    explanation: "'Ate' is the past simple form of 'eat'."
  },
  {
    question: "Choose the correct sentence.",
    options: ["I has a pen.", "I have a pen.", "I having a pen.", "I haves a pen."],
    answer: 1,
    explanation: "Use 'have' with I."
  },
  {
    question: "She is _____ honest person.",
    options: ["a", "an", "the only possible article is the", "no article"],
    answer: 1,
    explanation: "'Honest' begins with a vowel sound because its h is silent."
  }
];

/* ---------- COMMON HELPERS ---------- */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function updateDashboard() {
  $("#statLessons").textContent = progress.completedLessons.length;
  $("#statWords").textContent = progress.learnedWords.length;

  const accuracy = progress.quizTotal
    ? Math.round(progress.quizCorrect / progress.quizTotal * 100)
    : 0;

  $("#statAccuracy").textContent = accuracy + "%";
  $("#statAttempts").textContent =
    progress.quizTotal + " question" +
    (progress.quizTotal === 1 ? "" : "s") + " answered";

  const dailyWord = words[new Date().getDate() % words.length];
  $("#dashboardWord").textContent = dailyWord.word;
  $("#dashboardMeaning").textContent = dailyWord.urdu;
  $("#challengeWord").textContent = dailyWord.word.toLowerCase();
}

/* ---------- PAGE NAVIGATION ---------- */

function navigateTo(pageName) {
  const target = $("#" + pageName);
  if (!target) return;

  $$(".page").forEach((page) => page.classList.remove("active"));
  target.classList.add("active");

  $$(".nav-link").forEach((link) => {
    link.classList.toggle("active", link.dataset.page === pageName);
  });

  if (pageName === "lessons") renderLessons();
  if (pageName === "vocabulary") renderWords();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

$$("[data-page]").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    navigateTo(button.dataset.page);
  });
});

$$("[data-go]").forEach((button) => {
  button.addEventListener("click", () => navigateTo(button.dataset.go));
});

/* ---------- LESSONS ---------- */

function renderLessons() {
  const query = $("#lessonSearch").value.trim().toLowerCase();

  const filtered = lessons.filter((lesson) =>
    [lesson.title, lesson.category, lesson.description]
      .some((value) => value.toLowerCase().includes(query))
  );

  $("#lessonCount").textContent = filtered.length + " lessons";

  $("#lessonGrid").innerHTML = filtered.length
    ? filtered.map((lesson) => {
        const done = progress.completedLessons.includes(lesson.id);

        return `
          <article class="lesson-card">
            <div class="lesson-top">
              <span class="lesson-number">LESSON ${lesson.id}</span>
              <span class="status-pill ${done ? "done" : ""}">
                ${done ? "✓ Completed" : lesson.level}
              </span>
            </div>
            <h2>${escapeHTML(lesson.title)}</h2>
            <p>${escapeHTML(lesson.description)}</p>
            <button class="primary-btn" data-open-lesson="${lesson.id}">
              ${done ? "Review lesson" : "Start lesson"} →
            </button>
          </article>`;
      }).join("")
    : '<div class="empty-state">No lessons found. Try another search.</div>';

  $$("[data-open-lesson]").forEach((button) => {
    button.addEventListener("click", () => openLesson(Number(button.dataset.openLesson)));
  });
}

function openLesson(id) {
  const lesson = lessons.find((item) => item.id === id);
  if (!lesson) return;

  const detail = $("#lessonDetail");
  const done = progress.completedLessons.includes(id);

  detail.innerHTML = `
    <div class="lesson-top">
      <span class="lesson-number">LESSON ${lesson.id} · ${escapeHTML(lesson.category)}</span>
      <span class="status-pill">${escapeHTML(lesson.level)}</span>
    </div>
    <h2>${escapeHTML(lesson.title)}</h2>
    <p>${escapeHTML(lesson.explanation)}</p>
    <div class="lesson-example">
      <strong>Example</strong>
      <p>${escapeHTML(lesson.example)}</p>
      <p>${escapeHTML(lesson.translation)}</p>
    </div>
    <h3>Remember these points</h3>
    <ul>${lesson.points.map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul>
    <button id="completeLesson" class="primary-btn">
      ${done ? "✓ Already completed" : "Mark as completed"}
    </button>
  `;

  detail.classList.remove("hidden");
  detail.scrollIntoView({ behavior: "smooth", block: "start" });

  $("#completeLesson").addEventListener("click", () => {
    if (progress.completedLessons.includes(id)) {
      showToast("You have already completed this lesson.");
      return;
    }

    progress.completedLessons.push(id);
    saveProgress();
    renderLessons();
    openLesson(id);
    showToast("Lesson completed! Great work.");
  });
}

$("#lessonSearch").addEventListener("input", renderLessons);

/* ---------- VOCABULARY ---------- */

function renderWords() {
  const query = $("#wordSearch").value.trim().toLowerCase();
  const category = $("#wordCategory").value;

  const filtered = words.filter((item) => {
    const matchesSearch = [
      item.word, item.urdu, item.example, item.category
    ].some((value) => value.toLowerCase().includes(query));

    const matchesCategory = category === "All" || item.category === category;

    return matchesSearch && matchesCategory;
  });

  $("#wordCount").textContent = `${filtered.length} words available`;

  $("#wordGrid").innerHTML = filtered.length
    ? filtered.map((item) => {
        const learned = progress.learnedWords.includes(item.id);

        return `
          <article class="word-card">
            <div class="word-card-top">
              <h2>${escapeHTML(item.word)}</h2>
              <span class="word-category">${escapeHTML(item.category)}</span>
            </div>
            <p class="word-urdu" lang="ur">${escapeHTML(item.urdu)}</p>
            <p class="word-example">${escapeHTML(item.example)}</p>
            <div class="word-actions">
              <button data-pronounce="${item.id}">🔊 Listen</button>
              <button class="learned-btn" data-learn-word="${item.id}">
                ${learned ? "✓ Learned" : "+ Mark learned"}
              </button>
            </div>
          </article>`;
      }).join("")
    : '<div class="empty-state">No words found. Try another search.</div>';

  $$("[data-pronounce]").forEach((button) => {
    button.addEventListener("click", () => {
      const item = words.find((word) => word.id === Number(button.dataset.pronounce));
      if (item) speak(item.word);
    });
  });

  $$("[data-learn-word]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.learnWord);

      if (progress.learnedWords.includes(id)) {
        progress.learnedWords = progress.learnedWords.filter((wordId) => wordId !== id);
        showToast("Word removed from learned words.");
      } else {
        progress.learnedWords.push(id);
        showToast("Word marked as learned!");
      }

      saveProgress();
      renderWords();
    });
  });
}

$("#wordSearch").addEventListener("input", renderWords);
$("#wordCategory").addEventListener("change", renderWords);

/* ---------- SPEECH SUPPORT ---------- */

function speak(text) {
  if (!("speechSynthesis" in window)) {
    showToast("Speech playback is not supported in this browser.");
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.85;

  window.speechSynthesis.speak(utterance);
}

$("#speakBtn").addEventListener("click", () => {
  speak($("#speakingSentence").textContent);
});

/* ---------- QUIZ ---------- */

let quizIndex = 0;
let selectedAnswer = null;
let answered = false;
let quizSessionCorrect = 0;
let quizSessionTotal = 0;
let quizOrder = [];

function shuffleQuestions() {
  quizOrder = questions.map((_, index) => index);

  for (let i = quizOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizOrder[i], quizOrder[j]] = [quizOrder[j], quizOrder[i]];
  }
}

function currentQuestion() {
  return questions[quizOrder[quizIndex]];
}

function renderQuestion() {
  selectedAnswer = null;
  answered = false;

  const question = currentQuestion();

  $("#quizCounter").textContent =
    `Question ${quizIndex + 1} of ${quizOrder.length}`;

  $("#quizProgress").style.width =
    `${(quizIndex / quizOrder.length) * 100}%`;

  $("#quizQuestion").textContent = question.question;

  $("#quizOptions").innerHTML = question.options.map((option, index) => `
    <button class="quiz-option" data-answer="${index}">
      <strong>${String.fromCharCode(65 + index)}.</strong>
      ${escapeHTML(option)}
    </button>
  `).join("");

  $$(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      if (answered) return;

      selectedAnswer = Number(button.dataset.answer);

      $$(".quiz-option").forEach((option) => {
        option.classList.toggle(
          "selected",
          Number(option.dataset.answer) === selectedAnswer
        );
      });

      $("#quizFeedback").textContent = "";
      $("#quizFeedback").className = "feedback";
    });
  });

  $("#quizFeedback").textContent = "";
  $("#quizFeedback").className = "feedback";
  $("#checkAnswer").classList.remove("hidden");
  $("#nextQuestion").classList.add("hidden");
  $("#checkAnswer").disabled = false;
}

function finishQuiz() {
  $("#quizProgress").style.width = "100%";

  const percent = quizSessionTotal
    ? Math.round(quizSessionCorrect / quizSessionTotal * 100)
    : 0;

  $("#quizCounter").textContent = "Quiz completed";
  $("#quizQuestion").textContent = "Well done! You finished the quiz.";
  $("#quizOptions").innerHTML = `
    <div class="lesson-example">
      <h2>${percent}% accuracy</h2>
      <p>You answered ${quizSessionCorrect} out of ${quizSessionTotal} questions correctly in this session.</p>
      <p>Keep practicing to strengthen your English.</p>
    </div>`;

  $("#quizFeedback").textContent = "";
  $("#checkAnswer").classList.add("hidden");
  $("#nextQuestion").textContent = "Try another quiz ↻";
  $("#nextQuestion").classList.remove("hidden");
}

$("#checkAnswer").addEventListener("click", () => {
  if (selectedAnswer === null) {
    showToast("Please select an answer first.");
    return;
  }

  if (answered) return;

  answered = true;

  const question = currentQuestion();
  const isCorrect = selectedAnswer === question.answer;

  quizSessionTotal++;
  progress.quizTotal++;
  if (isCorrect) {
    quizSessionCorrect++;
    progress.quizCorrect++;
  }

  saveProgress();

  $$(".quiz-option").forEach((button) => {
    const index = Number(button.dataset.answer);
    button.disabled = 