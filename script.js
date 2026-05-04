const root = document.documentElement;

/* --------------------------
   Theme toggle
--------------------------- */
const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme === "dark") {
  root.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  if (isDark) {
    root.removeAttribute("data-theme");
    localStorage.setItem("portfolio-theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
    localStorage.setItem("portfolio-theme", "dark");
  }
});

/* --------------------------
   Hero role rotator
--------------------------- */
const roles = [
  "with measurable model outcomes.",
  "for robust retrieval pipelines.",
  "for scalable analytics decisions.",
  "with strong evaluation discipline."
];
const roleRotator = document.getElementById("role-rotator");
let roleIndex = 0;
let charIndex = 0;
let erasing = false;

function rotateRole() {
  const phrase = roles[roleIndex];
  if (!erasing) {
    charIndex += 1;
    roleRotator.textContent = phrase.slice(0, charIndex);
    if (charIndex === phrase.length) {
      erasing = true;
      setTimeout(rotateRole, 1200);
      return;
    }
  } else {
    charIndex -= 1;
    roleRotator.textContent = phrase.slice(0, charIndex);
    if (charIndex === 0) {
      erasing = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
  setTimeout(rotateRole, erasing ? 40 : 75);
}
rotateRole();

/* --------------------------
   Scroll reveal
--------------------------- */
const revealElements = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
revealElements.forEach((el) => revealObserver.observe(el));

/* --------------------------
   Nav highlight + top button
--------------------------- */
const navLinks = document.querySelectorAll(".nav a");
const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
        });
      }
    });
  },
  { threshold: 0.5 }
);
sections.forEach((section) => navObserver.observe(section));

const toTop = document.getElementById("to-top");
window.addEventListener("scroll", () => {
  toTop.classList.toggle("show", window.scrollY > 500);
});
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* --------------------------
   Metric counters
--------------------------- */
let metricsRun = false;
const metricNodes = document.querySelectorAll(".count");
const metricObserver = new IntersectionObserver(
  (entries) => {
    if (!entries[0].isIntersecting || metricsRun) return;
    metricsRun = true;

    metricNodes.forEach((node) => {
      const target = parseFloat(node.dataset.target || "0");
      const decimals = parseInt(node.dataset.decimals || "0", 10);
      const prefix = node.dataset.prefix || "";
      const suffix = node.dataset.suffix || "";
      const start = performance.now();
      const duration = 1200;

      function step(now) {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const value = target * eased;
        const formatted = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
        node.textContent = `${prefix}${formatted}${suffix}`;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  },
  { threshold: 0.45 }
);

const metricsSection = document.querySelector(".metrics");
if (metricsSection) metricObserver.observe(metricsSection);

/* --------------------------
   Skills directory
--------------------------- */
const technicalSkills = [
  { key: "python", name: "Python", logo: "https://cdn.simpleicons.org/python/3776AB", categories: ["data", "modeling"], context: "Coursework, internships, projects" },
  { key: "sql", name: "SQL", logo: "https://cdn.simpleicons.org/postgresql/4169E1", categories: ["data"], context: "Internships, analytics tasks" },
  { key: "pandas", name: "Pandas", logo: "https://cdn.simpleicons.org/pandas/150458", categories: ["data"], context: "Data preparation and analysis" },
  { key: "polars", name: "Polars", logo: "https://cdn.simpleicons.org/polars/CD792C", short: "POL", categories: ["data"], context: "High-performance data processing" },
  { key: "numpy", name: "NumPy", logo: "https://cdn.simpleicons.org/numpy/013243", categories: ["data"], context: "Numerical computing" },
  { key: "matplotlib", name: "Matplotlib", logo: "https://cdn.simpleicons.org/matplotlib/11557C", short: "MPL", categories: ["data"], context: "Visualization and reporting" },
  { key: "seaborn", name: "Seaborn", short: "SBN", categories: ["data"], context: "Statistical visualization" },
  { key: "powerbi", name: "Power BI", logo: "https://cdn.simpleicons.org/powerbi/F2C811", categories: ["data"], context: "Dashboarding and BI analytics" },
  { key: "sklearn", name: "Scikit-learn", logo: "https://cdn.simpleicons.org/scikitlearn/F7931E", short: "SKL", categories: ["modeling"], context: "Classical ML pipelines" },
  { key: "scipy", name: "SciPy", logo: "https://cdn.simpleicons.org/scipy/8CAAE6", categories: ["modeling"], context: "Scientific and optimization workflows" },
  { key: "optuna", name: "Optuna", short: "OPT", categories: ["modeling"], context: "Hyperparameter tuning" },
  { key: "tensorflow", name: "TensorFlow", logo: "https://cdn.simpleicons.org/tensorflow/FF6F00", categories: ["modeling"], context: "Deep learning experimentation" },
  { key: "pytorch", name: "PyTorch", logo: "https://cdn.simpleicons.org/pytorch/EE4C2C", categories: ["modeling"], context: "Deep learning and CV work" },
  { key: "transformers", name: "Transformers", logo: "https://cdn.simpleicons.org/huggingface/FFD21E", short: "TRF", categories: ["llm"], context: "NLP and GenAI modeling" },
  { key: "llm", name: "LLMs", short: "LLM", categories: ["llm"], context: "Prompt-based and retrieval-assisted apps" },
  { key: "rag", name: "RAG", short: "RAG", categories: ["llm"], context: "Retrieval-augmented assistant systems" },
  { key: "prompt", name: "Prompt Engineering", short: "PE", categories: ["llm"], context: "Prompt design and optimization" },
  { key: "langchain", name: "LangChain", short: "LC", categories: ["llm"], context: "Orchestration for RAG pipelines" },
  { key: "faiss", name: "FAISS", short: "FAI", categories: ["llm"], context: "Vector retrieval for semantic search" },
  { key: "ollama", name: "Ollama", short: "OLM", categories: ["llm", "deployment"], context: "Local LLM inference workflows" },
  { key: "flask", name: "Flask", logo: "https://cdn.simpleicons.org/flask/000000", categories: ["deployment"], context: "Backend APIs and lightweight services" },
  { key: "rest", name: "RESTful APIs", short: "API", categories: ["deployment"], context: "API integration and service design" },
  { key: "streamlit", name: "Streamlit", logo: "https://cdn.simpleicons.org/streamlit/FF4B4B", categories: ["deployment"], context: "Interactive ML app interfaces" },
  { key: "docker", name: "Docker", logo: "https://cdn.simpleicons.org/docker/2496ED", categories: ["deployment"], context: "Containerized setup and delivery" },
  { key: "hfspaces", name: "Hugging Face Spaces", logo: "https://cdn.simpleicons.org/huggingface/FFD21E", short: "HF", categories: ["deployment"], context: "Model app hosting and demos" },
  { key: "githubdesktop", name: "GitHub Desktop", logo: "https://cdn.simpleicons.org/github/181717", short: "GH", categories: ["deployment"], context: "Version control workflow" }
];

const skillsGrid = document.getElementById("skills-grid");
const skillsSearch = document.getElementById("skills-search");
const skillsEmpty = document.getElementById("skills-empty");
const skillFilterButtons = document.querySelectorAll("[data-skill-filter]");
let activeSkillFilter = "all";

function createSkillCard(skill) {
  const card = document.createElement("article");
  card.className = "skill-item";
  card.setAttribute("role", "listitem");

  const icon = document.createElement("div");
  icon.className = "skill-icon";

  const addFallback = () => {
    const mark = document.createElement("span");
    mark.className = "skill-mark";
    mark.textContent = skill.short || skill.name.replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
    icon.appendChild(mark);
  };

  if (skill.logo) {
    const img = document.createElement("img");
    img.src = skill.logo;
    img.alt = `${skill.name} logo`;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", () => {
      img.remove();
      addFallback();
    });
    icon.appendChild(img);
  } else {
    addFallback();
  }

  const meta = document.createElement("div");
  const title = document.createElement("p");
  title.className = "skill-name";
  title.textContent = skill.name;
  const context = document.createElement("p");
  context.className = "skill-context";
  context.textContent = skill.context;
  meta.append(title, context);

  card.append(icon, meta);
  return card;
}

function normalizeSkillText(value = "") {
  return value.toLowerCase().trim();
}

function matchesSkill(skill, searchQuery) {
  if (!searchQuery) return true;
  const haystack = normalizeSkillText(`${skill.name} ${skill.context} ${skill.categories.join(" ")}`);
  return haystack.includes(searchQuery);
}

function renderSkillsDirectory() {
  if (!skillsGrid) return;
  const query = normalizeSkillText(skillsSearch ? skillsSearch.value : "");
  const filtered = technicalSkills.filter((skill) => {
    const matchFilter = activeSkillFilter === "all" || skill.categories.includes(activeSkillFilter);
    return matchFilter && matchesSkill(skill, query);
  });

  skillsGrid.innerHTML = "";
  filtered.forEach((skill) => skillsGrid.appendChild(createSkillCard(skill)));

  if (skillsEmpty) {
    skillsEmpty.style.display = filtered.length === 0 ? "block" : "none";
  }
}

if (skillsSearch) {
  skillsSearch.addEventListener("input", renderSkillsDirectory);
}

skillFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    skillFilterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    activeSkillFilter = button.dataset.skillFilter || "all";
    renderSkillsDirectory();
  });
});

renderSkillsDirectory();

/* --------------------------
   Experience accordion
--------------------------- */
const xpNodes = document.querySelectorAll(".xp");

xpNodes.forEach((xp) => {
  const head = xp.querySelector(".xp-head");
  const body = xp.querySelector(".xp-body");

  head.addEventListener("click", () => {
    const isOpen = xp.classList.contains("open");

    xpNodes.forEach((node) => {
      node.classList.remove("open");
      node.querySelector(".xp-head").setAttribute("aria-expanded", "false");
      node.querySelector(".xp-body").style.maxHeight = "0px";
    });

    if (!isOpen) {
      xp.classList.add("open");
      head.setAttribute("aria-expanded", "true");
      body.style.maxHeight = `${body.scrollHeight + 10}px`;
    }
  });
});

/* --------------------------
   Projects filter/search
--------------------------- */
const projectSearch = document.getElementById("project-search");
const projectTypeButtons = document.querySelectorAll("[data-project]");
const projects = document.querySelectorAll(".project");
const projectEmpty = document.getElementById("project-empty");
let currentProjectType = "all";

function updateProjects() {
  const query = projectSearch.value.trim().toLowerCase();
  let shown = 0;

  projects.forEach((project) => {
    const type = project.dataset.type;
    const haystack = project.dataset.search || "";
    const matchType = currentProjectType === "all" || type === currentProjectType;
    const matchQuery = haystack.includes(query);
    const display = matchType && matchQuery;

    project.classList.toggle("hide", !display);
    if (display) shown += 1;
  });

  projectEmpty.style.display = shown === 0 ? "block" : "none";
}

projectSearch.addEventListener("input", updateProjects);
projectTypeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    projectTypeButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    currentProjectType = button.dataset.project;
    updateProjects();
  });
});

updateProjects();

/* --------------------------
   Project modal
--------------------------- */
const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

const projectDetails = {
  medical: {
    title: "Medical Assistant (RAG-based)",
    lines: [
      "Built a clinical QA assistant using retrieval over trusted sources.",
      "Benchmarked response quality against a pure LLM baseline.",
      "Focus: grounded output quality for reliability-sensitive scenarios."
    ]
  },
  helnet: {
    title: "HelNet Image Classification",
    lines: [
      "Safety-oriented image classifier for helmet compliance.",
      "Used CNN + VGG16 transfer learning and augmentation.",
      "Focus: robust generalization for practical deployment contexts."
    ]
  },
  octant: {
    title: "Octant Analysis (Streamlit)",
    lines: [
      "Interactive app for single and batch octant analysis workflows.",
      "Designed to streamline repetitive analysis tasks.",
      "Focus: usability and reproducible outputs for assignment workflows."
    ]
  },
  bitcoin: {
    title: "Bitcoin Time Series Forecasting",
    lines: [
      "Forecasting with ARIMA and indicator engineering (VWAP/EMA/SMA).",
      "Team project with emphasis on model behavior and interpretation.",
      "Focus: time-series feature design and financial trend signals."
    ]
  },
  ipl: {
    title: "IPL Scorecard Dashboard",
    lines: [
      "Power BI dashboard built from scraped scorecard data.",
      "Analyzed teams, bowlers, and match patterns interactively.",
      "Focus: turning sports data into decision-ready dashboards."
    ]
  },
  transcript: {
    title: "Transcript Generator",
    lines: [
      "Batch transcript automation from multiple CSV inputs.",
      "Generated individualized, structured PDF outputs.",
      "Focus: data validation and automation correctness at scale."
    ]
  },
  multicam: {
    title: "Multi-Camera CV System",
    lines: [
      "Built a synchronized multi-camera pipeline for object tracking across overlapping fields of view.",
      "Handled cross-camera re-identification and frame alignment challenges.",
      "Focus: robust detection continuity and real-time multi-feed inference."
    ]
  },
  ragconvex: {
    title: "RAG + Convex Optimization",
    lines: [
      "Integrated convex optimization techniques into a RAG retrieval pipeline to improve document ranking.",
      "Experimented with embedding space regularization and query-passage alignment objectives.",
      "Focus: principled retrieval quality improvements grounded in optimization theory."
    ]
  },
  whitehat: {
    title: "WhiteHat",
    lines: [
      "Developed an automated toolkit for ethical hacking and security reconnaissance workflows.",
      "Implemented modular scanners for vulnerability assessment and enumeration.",
      "Focus: reproducible, auditable security automation for authorized testing."
    ]
  },
  animerag: {
    title: "AnimeRAG",
    lines: [
      "Built a RAG-based anime recommendation and Q&A system over curated metadata and synopses.",
      "Indexed embeddings across titles, genres, and review corpora for semantic retrieval.",
      "Focus: domain-specific retrieval with conversational interface for anime discovery."
    ]
  }
};

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll(".open-modal").forEach((button) => {
  button.addEventListener("click", () => {
    const id = button.dataset.id;
    const info = projectDetails[id];
    if (!info) return;

    modalTitle.textContent = info.title;
    modalBody.innerHTML = `<ul>${info.lines.map((line) => `<li>${line}</li>`).join("")}</ul>`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  });
});

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

/* --------------------------
   Command palette
--------------------------- */
const palette = document.getElementById("command-palette");
const paletteToggle = document.getElementById("palette-toggle");
const paletteInput = document.getElementById("palette-input");
const paletteList = document.getElementById("palette-list");

const paletteActions = [
  { label: "Go to Home", run: () => document.getElementById("home").scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to About", run: () => document.getElementById("about").scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Skills", run: () => document.getElementById("skills").scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Experience", run: () => document.getElementById("work").scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Projects", run: () => document.getElementById("projects").scrollIntoView({ behavior: "smooth" }) },
  { label: "Go to Contact", run: () => document.getElementById("contact").scrollIntoView({ behavior: "smooth" }) },
  { label: "Open GitHub", run: () => window.open("https://github.com/Lord2709", "_blank", "noopener") },
  { label: "Open LinkedIn", run: () => window.open("https://www.linkedin.com/in/sahil-chaudhari-264210164/", "_blank", "noopener") }
];

let paletteIndex = 0;
let filteredActions = [...paletteActions];

function closePalette() {
  palette.classList.remove("open");
  palette.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function renderPalette() {
  paletteList.innerHTML = "";

  filteredActions.forEach((action, idx) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = action.label;
    button.className = idx === paletteIndex ? "active" : "";
    button.addEventListener("click", () => {
      action.run();
      closePalette();
    });
    li.appendChild(button);
    paletteList.appendChild(li);
  });
}

function openPalette() {
  palette.classList.add("open");
  palette.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  paletteInput.value = "";
  filteredActions = [...paletteActions];
  paletteIndex = 0;
  renderPalette();
  setTimeout(() => paletteInput.focus(), 20);
}

paletteToggle.addEventListener("click", openPalette);

document.addEventListener("keydown", (event) => {
  const isK = event.key.toLowerCase() === "k";
  if ((event.ctrlKey || event.metaKey) && isK) {
    event.preventDefault();
    if (palette.classList.contains("open")) closePalette();
    else openPalette();
    return;
  }

  if (!palette.classList.contains("open")) return;

  if (event.key === "Escape") {
    closePalette();
    return;
  }

  if (event.key === "ArrowDown") {
    event.preventDefault();
    paletteIndex = (paletteIndex + 1) % Math.max(filteredActions.length, 1);
    renderPalette();
  }

  if (event.key === "ArrowUp") {
    event.preventDefault();
    paletteIndex = (paletteIndex - 1 + Math.max(filteredActions.length, 1)) % Math.max(filteredActions.length, 1);
    renderPalette();
  }

  if (event.key === "Enter" && filteredActions[paletteIndex]) {
    event.preventDefault();
    filteredActions[paletteIndex].run();
    closePalette();
  }
});

paletteInput.addEventListener("input", () => {
  const q = paletteInput.value.trim().toLowerCase();
  filteredActions = paletteActions.filter((action) => action.label.toLowerCase().includes(q));
  paletteIndex = 0;
  renderPalette();
});

palette.addEventListener("click", (event) => {
  if (event.target === palette) closePalette();
});

/* --------------------------
   Background network animation
--------------------------- */
const networkCanvas = document.getElementById("bg-network");
const networkCtx = networkCanvas.getContext("2d");
let points = [];
let pointer = { x: -999, y: -999 };

function resizeNetworkCanvas() {
  networkCanvas.width = window.innerWidth;
  networkCanvas.height = window.innerHeight;

  const area = window.innerWidth * window.innerHeight;
  const targetCount = Math.max(36, Math.floor(area / 28000));
  points = Array.from({ length: targetCount }, () => ({
    x: Math.random() * networkCanvas.width,
    y: Math.random() * networkCanvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35
  }));
}

function drawNetwork() {
  networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);

  const isDark = root.getAttribute("data-theme") === "dark";
  const pointColor = isDark ? "rgba(70, 215, 196, 0.85)" : "rgba(14, 132, 120, 0.55)";
  const lineColor = isDark ? "rgba(70, 215, 196, 0.17)" : "rgba(14, 132, 120, 0.14)";

  points.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0 || p.x > networkCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > networkCanvas.height) p.vy *= -1;

    networkCtx.beginPath();
    networkCtx.arc(p.x, p.y, 2, 0, Math.PI * 2);
    networkCtx.fillStyle = pointColor;
    networkCtx.fill();
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const dx = points[i].x - points[j].x;
      const dy = points[i].y - points[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        networkCtx.strokeStyle = lineColor;
        networkCtx.lineWidth = 1 - dist / 120;
        networkCtx.beginPath();
        networkCtx.moveTo(points[i].x, points[i].y);
        networkCtx.lineTo(points[j].x, points[j].y);
        networkCtx.stroke();
      }
    }

    const pdx = points[i].x - pointer.x;
    const pdy = points[i].y - pointer.y;
    const pDist = Math.sqrt(pdx * pdx + pdy * pdy);
    if (pDist < 140) {
      networkCtx.strokeStyle = isDark ? "rgba(249, 115, 22, 0.24)" : "rgba(249, 115, 22, 0.22)";
      networkCtx.lineWidth = 1.1 - pDist / 140;
      networkCtx.beginPath();
      networkCtx.moveTo(points[i].x, points[i].y);
      networkCtx.lineTo(pointer.x, pointer.y);
      networkCtx.stroke();
    }
  }

  requestAnimationFrame(drawNetwork);
}

window.addEventListener("mousemove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
});

window.addEventListener("mouseleave", () => {
  pointer.x = -999;
  pointer.y = -999;
});

window.addEventListener("resize", resizeNetworkCanvas);
resizeNetworkCanvas();
drawNetwork();
