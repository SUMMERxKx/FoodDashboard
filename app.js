const SECTIONS = [
  {
    title: "Restaurants",
    items: [
      {
        id: "lao-shan-dong",
        name: "Lao Shan Dong",
        native: "老山東麵莊",
        area: "Richmond",
        tag: "My favourite",
        order: "Beef and tendon in tomato broth with wide noodles.",
        warn: "Do not get the bean thread noodles.",
        maps: "Lao Shan Dong Richmond BC",
      },
      {
        id: "kam-do",
        name: "Kam Do Bakery",
        area: "Richmond",
        order: "Portuguese egg tarts, pineapple buns and wife cakes.",
        maps: "Kam Do Bakery Richmond BC",
      },
      {
        id: "jing-tan",
        name: "Jing Tan Grill House",
        area: "Richmond",
        kind: "All you can eat charcoal BBQ",
        order: "Beef belly and the marinated meats.",
        maps: "Jing Tan Grill House Richmond BC",
      },
      {
        id: "gyubee",
        name: "Gyubee Japanese Grill",
        area: "Richmond",
        kind: "All you can eat Japanese BBQ",
        order: "Kalbi beef and beef tongue. Finish with the crème brûlée.",
        maps: "Gyubee Japanese Grill Richmond BC",
      },
      {
        id: "haidilao",
        name: "Haidilao Hot Pot",
        native: "海底捞火锅",
        area: "West Broadway",
        kind: "Hot pot",
        order: "Tomato and spicy broth, sliced beef and the hand-pulled noodles.",
        maps: "Haidilao Hot Pot West Broadway Vancouver",
      },
      {
        id: "mr-shawarma",
        name: "Mr. Shawarma",
        area: "Downtown",
        tag: "My pick",
        order: "Spicy chicken shawarma from the food cart.",
        maps: "Mr. Shawarma food cart Downtown Vancouver",
      },
      {
        id: "chicken-world",
        name: "Chicken World",
        area: "1181 Denman St, West End",
        tag: "My pick",
        order: "The Gabbar Burger.",
        maps: "Chicken World 1181 Denman Street Vancouver",
      },
    ],
  },
  {
    title: "Cafés & bakeries",
    items: [
      {
        id: "slo",
        name: "Slo Coffee",
        area: "609 Granville St, Downtown",
        order: "Pistachio matcha latte or the Okinawa brown sugar latte.",
        note: "Go to the downtown one, inside Pacific Centre by Granville Station.",
        maps: "Slo Coffee 609 Granville St Vancouver",
      },
      {
        id: "bake49",
        name: "Bake49",
        area: "Yaletown",
        order: "Garlic cream cheese bagel or the breakfast bagel sandwich.",
        maps: "Bake49 Yaletown Vancouver",
      },
      {
        id: "analog",
        name: "Analog Coffee",
        area: "Yaletown",
        order: "Cappuccino and a smashed almond croissant.",
        maps: "Analog Coffee Yaletown Vancouver",
      },
      {
        id: "breka",
        name: "Breka Bakery & Café",
        area: "Davie St, plus other locations",
        tag: "Must visit",
        kind: "Open 24/7",
        order: "Apple fritter, Earl Grey cream puff, or any cake slice.",
        maps: "Breka Bakery Davie Street Vancouver",
      },
    ],
  },
];

const STORAGE_KEY = "vancouver-eats:tried";
const ALL_ITEMS = SECTIONS.flatMap((s) => s.items);

const loadTried = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
};

const saveTried = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...tried]));
  } catch {
    // Storage can be unavailable in private mode; the list still works for this visit.
  }
};

const tried = loadTried();
let filter = "all";

const listEl = document.getElementById("list");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("count");
const totalEl = document.getElementById("total");
const fillEl = document.getElementById("fill");
const doneNoteEl = document.getElementById("done-note");

const escape = (str) =>
  str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const googleMapsUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

const appleMapsUrl = (query) => `https://maps.apple.com/?q=${encodeURIComponent(query)}`;

const pinIcon = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s4.5-4.2 4.5-8a4.5 4.5 0 1 0-9 0c0 3.8 4.5 8 4.5 8z" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="8" cy="6.5" r="1.6" fill="currentColor"/></svg>`;
const arrowIcon = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const checkIcon = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const renderItem = (item, index) => {
  const isDone = tried.has(item.id);
  const number = String(index + 1).padStart(2, "0");
  return `
    <article class="card${isDone ? " is-done" : ""}" data-id="${item.id}">
      <div class="card__body">
        <div class="card__meta">
          <span class="card__num">${number}</span>
          ${item.tag ? `<span class="tag">${escape(item.tag)}</span>` : ""}
          ${item.kind ? `<span class="kind">${escape(item.kind)}</span>` : ""}
        </div>
        <h3 class="card__name">
          ${escape(item.name)}
          ${item.native ? `<span class="card__native" lang="zh">${item.native}</span>` : ""}
        </h3>
        <p class="card__order"><span class="card__label">Order</span>${escape(item.order)}</p>
        ${item.warn ? `<p class="card__warn">${escape(item.warn)}</p>` : ""}
        ${item.note ? `<p class="card__note">${escape(item.note)}</p>` : ""}
        <div class="card__foot">
          <span class="card__place">${pinIcon}<span>${escape(item.area)}</span></span>
          <div class="maps-row">
            <a class="maps" href="${googleMapsUrl(item.maps)}" target="_blank" rel="noopener">
              Google Maps ${arrowIcon}
            </a>
            <a class="maps" href="${appleMapsUrl(item.maps)}" target="_blank" rel="noopener">
              Apple Maps ${arrowIcon}
            </a>
          </div>
        </div>
      </div>
      <button class="check" type="button" aria-pressed="${isDone}" aria-label="Mark ${escape(item.name)} as tried">
        ${checkIcon}
      </button>
    </article>`;
};

const render = () => {
  let index = 0;
  let visible = 0;
  listEl.innerHTML = SECTIONS.map((section) => {
    const cards = section.items
      .map((item) => {
        const html = renderItem(item, index++);
        const isDone = tried.has(item.id);
        const show = filter === "all" || (filter === "done" ? isDone : !isDone);
        if (!show) return "";
        visible++;
        return html;
      })
      .join("");
    if (!cards) return "";
    const doneInSection = section.items.filter((i) => tried.has(i.id)).length;
    return `
      <section class="section">
        <div class="section__head">
          <h2>${escape(section.title)}</h2>
          <span class="section__count">${doneInSection}/${section.items.length}</span>
        </div>
        ${cards}
      </section>`;
  }).join("");

  emptyEl.hidden = visible > 0;
  emptyEl.textContent = filter === "done" ? "Nothing ticked off yet." : "You've tried everything on the list.";
  updateProgress();
};

const updateProgress = () => {
  const done = ALL_ITEMS.filter((i) => tried.has(i.id)).length;
  countEl.textContent = done;
  totalEl.textContent = ALL_ITEMS.length;
  fillEl.style.width = `${(done / ALL_ITEMS.length) * 100}%`;
  doneNoteEl.hidden = done !== ALL_ITEMS.length;
};

listEl.addEventListener("click", (e) => {
  const button = e.target.closest(".check");
  if (!button) return;
  const card = button.closest(".card");
  const id = card.dataset.id;
  const nowDone = !tried.has(id);
  if (nowDone) tried.add(id);
  else tried.delete(id);
  saveTried();
  if (navigator.vibrate) navigator.vibrate(8);

  // Toggle in place so the tap animates, unless the current filter would hide the card.
  if (filter === "all") {
    card.classList.toggle("is-done", nowDone);
    button.setAttribute("aria-pressed", String(nowDone));
    const section = card.closest(".section");
    const sectionData = SECTIONS.find((s) => s.items.some((i) => i.id === id));
    section.querySelector(".section__count").textContent =
      `${sectionData.items.filter((i) => tried.has(i.id)).length}/${sectionData.items.length}`;
    updateProgress();
  } else {
    card.classList.add("is-leaving");
    setTimeout(render, 220);
  }
});

document.querySelectorAll(".filter").forEach((btn) => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((b) => {
      const active = b === btn;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-pressed", String(active));
    });
    render();
  });
});

document.getElementById("reset").addEventListener("click", () => {
  if (!tried.size) return;
  if (!confirm("Clear every tick and start the list over?")) return;
  tried.clear();
  saveTried();
  render();
});

render();
