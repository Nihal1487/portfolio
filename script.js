document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(Draggable);

  // --- Boot Sequence ---
  const bootLoader = document.getElementById("boot-loader");
  if (bootLoader) {
    const bootLog = document.getElementById("boot-log");
    const progressBar = document.getElementById("progress-bar");
    const bootMessages = [
      "Initializing BentoOS v1.0...",
      "Mounting virtual file system...",
      "Loading kernel modules...",
      "Starting window manager...",
      "Calibrating quantum UI...",
      "Finalizing boot sequence...",
      "Welcome, Nihal.",
    ];
    let messageIndex = 0;
    const bootTl = gsap.timeline({
      onComplete: () => {
        gsap.to(bootLoader, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => (bootLoader.style.display = "none"),
        });
      },
    });
    bootTl.to(progressBar, {
      width: "100%",
      duration: bootMessages.length * 0.4,
      ease: "linear",
    });
    function showBootMessage() {
      if (messageIndex < bootMessages.length) {
        const p = document.createElement("p");
        p.textContent = `[${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}] ${bootMessages[messageIndex]}`;
        bootLog.appendChild(p);
        bootLog.scrollTop = bootLog.scrollHeight;
        messageIndex++;
        setTimeout(showBootMessage, 400);
      }
    }
    showBootMessage();
  }

  // --- Clock ---
  const clockElement = document.getElementById("clock");
  function updateClock() {
    if (clockElement)
      clockElement.textContent = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- Window Management ---
  const windows = document.querySelectorAll(".window");
  let zIndexCounter = 10;
  windows.forEach((win) => {
    Draggable.create(win, {
      trigger: ".window-header",
      bounds: "body",
      onPress: function () {
        zIndexCounter++;
        this.target.style.zIndex = zIndexCounter;
      },
    });
    win.addEventListener("click", () => {
      zIndexCounter++;
      win.style.zIndex = zIndexCounter;
    });
    win.querySelector(".close-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      gsap.to(win, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        onComplete: () => (win.style.visibility = "hidden"),
      });
    });
  });

  function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
    win.style.visibility = "visible";
    gsap.fromTo(
      win,
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
    );

    if (windowId === "system-monitor-window") {
      animateSkillBars();
    }
  }

  document.querySelectorAll("[data-window]").forEach((el) => {
    el.addEventListener("dblclick", () => openWindow(el.dataset.window));
  });

  // --- Dock Hover Effect ---
  const dockItems = document.querySelectorAll(".dock-item");
  const dock = document.getElementById("dock");
  dock.addEventListener("mousemove", (e) => {
    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;
    dockItems.forEach((item) => {
      const itemRect = item.getBoundingClientRect();
      const itemCenterX = itemRect.left - dockRect.left + itemRect.width / 2;
      const distance = Math.abs(mouseX - itemCenterX);
      const scale = Math.max(1, 1.8 - distance / 100);
      gsap.to(item, { scale: scale, duration: 0.2 });
    });
  });
  dock.addEventListener("mouseleave", () => {
    gsap.to(dockItems, { scale: 1, duration: 0.2 });
  });

  // --- System Monitor Logic ---
  const skillBarsContainer = document.getElementById("skill-bars");
  const processList = document.getElementById("process-list");
  const skillsData = [
    { name: "React / Next.js", level: 95 },
    { name: "Node.js / Express", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Databases (SQL/NoSQL)", level: 80 },
    { name: "GSAP / Three.js", level: 90 },
    { name: "C / C++", level: 75 },
  ];
  skillsData.forEach((skill) => {
    const item = document.createElement("li");
    item.className = "skill-bar-item";
    item.innerHTML = `<label>${skill.name}</label><div class="skill-bar"><div class="skill-bar-fill" data-level="${skill.level}"></div></div>`;
    skillBarsContainer.appendChild(item);
  });
  function animateSkillBars() {
    document.querySelectorAll(".skill-bar-fill").forEach((bar) => {
      const level = bar.dataset.level;
      gsap.fromTo(
        bar,
        { width: "0%" },
        {
          width: `${level}%`,
          duration: 1,
          ease: "power2.out",
          delay: 0.3,
        }
      );
    });
  }
  const processes = [
    { name: "Prisma", usage: "12.1%" },
    { name: "GSAP.js", usage: "10.5%" },
    { name: "ShadCN", usage: "8.3%" },
    { name: "TypeScript", usage: "7.4%" },
    { name: "Git", usage: "6.9%" },
    { name: "AWS_EC2", usage: "5.1%" },
  ];
  function updateProcesses() {
    if (processList) {
      processList.innerHTML = "";
      processes.forEach((p) => {
        const usageValue = parseFloat(p.usage);
        const newUsage = usageValue + (Math.random() - 0.5);
        p.usage = `${Math.max(2, Math.min(20, newUsage)).toFixed(1)}%`;
        const item = document.createElement("div");
        item.className = "process-item";
        item.innerHTML = `<span class="process-name">${p.name}</span><span class="process-usage">${p.usage}</span>`;
        processList.appendChild(item);
      });
    }
  }
  setInterval(updateProcesses, 2000);
  updateProcesses();

  // --- Settings Logic ---
  const themeOptionsContainer = document.getElementById("theme-options");
  const themes = {
    green: "#00ff88",
    blue: "#00c6ff",
    pink: "#ff00c1",
    orange: "#ff4800",
  };
  for (const [name, color] of Object.entries(themes)) {
    const swatch = document.createElement("div");
    swatch.className = "theme-swatch";
    if (
      color ===
      getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-color")
        .trim()
    ) {
      swatch.classList.add("active");
    }
    swatch.style.background = color;
    swatch.dataset.color = color;
    themeOptionsContainer.appendChild(swatch);
    swatch.addEventListener("click", () => {
      document.documentElement.style.setProperty("--accent-color", color);
      document
        .querySelectorAll(".theme-swatch")
        .forEach((s) => s.classList.remove("active"));
      swatch.classList.add("active");
    });
  }
});
