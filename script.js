const APPWRITE_ENDPOINT = "https://cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "sgp-6a7b31350025fd82af3a";
const APPWRITE_DATABASE_ID = "6a7b3452001a36124d38";
const APPWRITE_TABLE_ID = "wedding_config";
const APPWRITE_DOCUMENT_ID = "main";
const APPWRITE_GALLERY_TABLE_ID = "wedding_gallery";

async function getWeddingConfig() {
  const response = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/tables/${APPWRITE_TABLE_ID}/rows/${APPWRITE_DOCUMENT_ID}`,
    {
      method: "GET",
      headers: {
        "X-Appwrite-Project": APPWRITE_PROJECT_ID
      }
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Appwrite error:", result);
    throw new Error(result.message || "Gagal mengambil konfigurasi.");
  }

  return result.data;
}

// ===== ADMIN CONFIG (frontend test; later replaced by Supabase) =====
const DEFAULT_CONFIG={bride:"Alya",groom:"Arkan",weddingDate:"2026-09-11",venue:"Pendopo Mataram",city:"Yogyakarta",akadTime:"09:00 WIB",receptionTime:"19:00 WIB",mapsUrl:"",bankName:"BANK BCA",bankAccount:"1234567890",bankHolder:"Alya & Arkan"};
function loadWeddingConfig(){try{return {...DEFAULT_CONFIG,...JSON.parse(localStorage.getItem("demo_config")||"{}")}}catch{return DEFAULT_CONFIG}}
function formatWeddingDate(s){const d=new Date((s||"2026-09-11")+"T00:00:00");return Number.isNaN(d.getTime())?"11 · 09 · 2026":`${String(d.getDate()).padStart(2,"0")} · ${String(d.getMonth()+1).padStart(2,"0")} · ${d.getFullYear()}`}
function applyWeddingConfig(){const c=loadWeddingConfig();const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};set("brideName",c.bride);set("groomName",c.groom);set("navCouple",`${c.bride} & ${c.groom}`);document.title=`${c.bride} & ${c.groom} — Wedding Invitation`;set("heroDate",formatWeddingDate(c.weddingDate));set("akadTimeDisplay",c.akadTime);set("receptionTimeDisplay",c.receptionTime);set("venueName",c.venue);set("venueName2",c.venue);set("cityName",c.city);set("cityName2",c.city);set("bankNameDisplay",c.bankName);set("accountNumber",c.bankAccount);set("bankHolderDisplay",c.bankHolder);const b=document.getElementById("mapsBtn");if(b)b.onclick=()=>c.mapsUrl?window.open(c.mapsUrl,"_blank","noopener"):showToast("Link Google Maps belum diisi di Admin.")}
applyWeddingConfig();

// ============================================================
// DYNAMIC GUEST NAME — NO GUEST MASTER DATA IN SUPABASE
//
// Supported:
//   https://domain.com/andika-pratama
//   https://domain.com/?to=Andika%20Pratama
//
// The pathname is preferred. The name exists only in the URL
// until the guest voluntarily submits the RSVP.
// ============================================================
function slugToGuestName(slug) {
  return decodeURIComponent(slug)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function getGuestNameFromUrl() {

  const params = new URLSearchParams(window.location.search);

  const raw =
    params.get("to") ||
    params.get("guest") ||
    params.get("nama") ||
    "";

  return raw
    .trim()
    .replace(/\+/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function applyGuestName() {

  const name = getGuestNameFromUrl();

  const display =
    document.getElementById("guestNameDisplay");

  const greeting =
    document.getElementById("guestGreeting");

  const rsvpGuestName =
    document.getElementById("rsvpGuestName");

  const guestNameInput =
    document.getElementById("guestName");


  if (!name) return;


  /* =========================
     WELCOME
     ========================= */

  if (display) {
    display.textContent = name;
  }


  if (greeting) {

    greeting.innerHTML =
      `Dengan hormat, kami mengundang ` +
      `<strong>${escapeHtml(name)}</strong>` +
      ` untuk hadir dan menjadi bagian dari hari bahagia kami.`;

  }


  /* =========================
     PAGE TITLE
     ========================= */

  document.title =
    `Undangan Alya & Arkan — ${name}`;

}

applyGuestName();

const countdownConfig=loadWeddingConfig();
const weddingDate=new Date((countdownConfig.weddingDate||"2026-09-11")+"T09:00:00+07:00");

function updateCountdown(){
  const diff = weddingDate - new Date();
  if(diff <= 0){
    ["days","hours","minutes","seconds"].forEach(id=>document.getElementById(id).textContent="00");
    return;
  }
  const days = Math.floor(diff/86400000);
  const hours = Math.floor(diff%86400000/3600000);
  const minutes = Math.floor(diff%3600000/60000);
  const seconds = Math.floor(diff%60000/1000);
  document.getElementById("days").textContent=String(days).padStart(2,"0");
  document.getElementById("hours").textContent=String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent=String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent=String(seconds).padStart(2,"0");
}
setInterval(updateCountdown,1000); updateCountdown();

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("show")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

function makePetal(){
  const p=document.createElement("span"); p.className="petal";
  p.style.left=Math.random()*100+"vw";
  p.style.setProperty("--x",(Math.random()*2-1)*180+"px");
  p.style.setProperty("--r",(Math.random()*900-450)+"deg");
  p.style.animationDuration=(5+Math.random()*6)+"s";
  p.style.width=(8+Math.random()*9)+"px";
  p.style.height=(12+Math.random()*12)+"px";
  p.style.opacity=.45+Math.random()*.45;
  document.getElementById("petals").appendChild(p);
  setTimeout(()=>p.remove(),12000);
}
setInterval(makePetal,420);
for(let i=0;i<16;i++) setTimeout(makePetal,i*180);

document.getElementById("openInvitation").addEventListener("click",()=>{
  showToast("Selamat datang di undangan kami ✨");
  document.getElementById("welcome").scrollIntoView({behavior:"smooth"});
});

document.getElementById("rsvpForm").addEventListener("submit",e=>{
  e.preventDefault();
  const urlGuest = getGuestNameFromUrl();
  const typedGuest = document.getElementById("guestName").value.trim();
  const data={
    name:typedGuest || urlGuest || "Tamu",
    attendance:document.getElementById("attendance").value,
    count:Number(document.getElementById("guestCount").value||1),
    message:document.getElementById("message").value,
    time:new Date().toISOString()
  };
  const list=JSON.parse(localStorage.getItem("demo_rsvp")||"[]");
  list.push(data); localStorage.setItem("demo_rsvp",JSON.stringify(list));
  e.target.reset();
  document.getElementById("guestCount").value=1;
  document.getElementById("rsvpMessage").textContent="RSVP berhasil disimpan. Terima kasih ❤️";
  showToast("RSVP tersimpan");
});

function copyAccount(){
  navigator.clipboard?.writeText(document.getElementById("accountNumber").textContent.trim());
  showToast("Nomor rekening disalin ✓");
}
function showToast(text){
  const t=document.getElementById("toast"); t.textContent=text; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2200);
}

const urlGuestName = getGuestNameFromUrl();
if (urlGuestName) {
  const input = document.getElementById("guestName");
  if (input) {
    input.value = urlGuestName;
  }
}

/* =========================================================
   GALLERY LIGHTBOX
   ========================================================= */

const galleryPhotos = [
  "assets/gallery-1.jpg",
  "assets/gallery-2.jpg",
  "assets/gallery-3.jpg",
  "assets/gallery-4.jpg"
];

const galleryLightbox =
  document.getElementById("galleryLightbox");

const galleryLightboxImage =
  document.getElementById("galleryLightboxImage");

const galleryCurrent =
  document.getElementById("galleryCurrent");

const galleryTotal =
  document.getElementById("galleryTotal");

const galleryClose =
  document.getElementById("galleryClose");

const galleryPrev =
  document.getElementById("galleryPrev");

const galleryNext =
  document.getElementById("galleryNext");

let currentGalleryIndex = 0;

if (galleryTotal) {
  galleryTotal.textContent =
    String(galleryPhotos.length).padStart(2, "0");
}

function openGallery(index) {

  if (!galleryLightbox || !galleryLightboxImage) {
    return;
  }

  currentGalleryIndex = index;

  galleryLightboxImage.src =
    galleryPhotos[currentGalleryIndex];

  galleryCurrent.textContent =
    String(currentGalleryIndex + 1).padStart(2, "0");

  galleryLightbox.classList.add("active");

  galleryLightbox.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";
}

function closeGallery() {

  if (!galleryLightbox) {
    return;
  }

  galleryLightbox.classList.remove("active");

  galleryLightbox.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";
}

function nextGallery() {

  currentGalleryIndex++;

  if (
    currentGalleryIndex >=
    galleryPhotos.length
  ) {
    currentGalleryIndex = 0;
  }

  openGallery(currentGalleryIndex);
}

function previousGallery() {

  currentGalleryIndex--;

  if (currentGalleryIndex < 0) {
    currentGalleryIndex =
      galleryPhotos.length - 1;
  }

  openGallery(currentGalleryIndex);
}


/* Klik foto */

document
  .querySelectorAll(".gallery-photo")
  .forEach((photo) => {

    photo.addEventListener("click", () => {

      const index =
        Number(photo.dataset.gallery);

      openGallery(index);

    });

  });


/* Tombol */

galleryClose?.addEventListener(
  "click",
  closeGallery
);

galleryNext?.addEventListener(
  "click",
  nextGallery
);

galleryPrev?.addEventListener(
  "click",
  previousGallery
);


/* Klik area luar foto */

galleryLightbox?.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      galleryLightbox
    ) {
      closeGallery();
    }

  }
);


/* Keyboard */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      !galleryLightbox?.classList.contains(
        "active"
      )
    ) {
      return;
    }

    if (event.key === "Escape") {
      closeGallery();
    }

    if (event.key === "ArrowRight") {
      nextGallery();
    }

    if (event.key === "ArrowLeft") {
      previousGallery();
    }

  }
);

/* =========================================================
   PREMIUM FALLING JAVA PETALS
   ========================================================= */

const petalContainer = document.getElementById("petals");

const petalSymbols = [
  "🍂",
  "🍁",
  "🌿",
  "✿",
  "❀"
];

function createPremiumPetal() {

  if (!petalContainer) return;

  const petal = document.createElement("span");

  petal.className = "premium-petal";

  const symbol =
    petalSymbols[
      Math.floor(
        Math.random() * petalSymbols.length
      )
    ];

  petal.textContent = symbol;

  const size =
    Math.random() * 15 + 9;

  const duration =
    Math.random() * 7 + 8;

  const delay =
    Math.random() * -10;

  const startX =
    Math.random() * 100;

  const drift =
    Math.random() * 180 - 90;

  const rotate =
    Math.random() * 900 - 450;

  const depth =
    Math.random();

  petal.style.left =
    `${startX}%`;

  petal.style.fontSize =
    `${size}px`;

  petal.style.setProperty(
    "--drift",
    `${drift}px`
  );

  petal.style.setProperty(
    "--rotate",
    `${rotate}deg`
  );

  petal.style.animationDuration =
    `${duration}s`;

  petal.style.animationDelay =
    `${delay}s`;

  /*
    Depth:
    semakin kecil = semakin jauh
  */

  petal.style.opacity =
    0.25 + depth * 0.65;

  const blur =
    (1 - depth) * 2.5;

  petal.style.filter =
    `blur(${blur}px)`;

  petal.style.transform =
    `scale(${0.55 + depth * 0.65})`;

  petalContainer.appendChild(
    petal
  );

  setTimeout(() => {

    petal.remove();

  }, (duration + 2) * 1000);
}


/* Create petals */

for (
  let i = 0;
  i < 22;
  i++
) {

  setTimeout(
    createPremiumPetal,
    i * 350
  );

}


/* Continuous */

setInterval(
  createPremiumPetal,
  650
);

/* =========================================================
   GLASS SLIDE REVEAL
   ========================================================= */

const glassRevealItems =
  document.querySelectorAll(
    ".content-card.reveal"
  );

const glassObserver =
  new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add(
            "glass-visible"
          );

          glassObserver.unobserve(
            entry.target
          );

        }

      });

    },
    {
      threshold: 0.12
    }
  );

glassRevealItems.forEach((item) => {

  glassObserver.observe(item);

});

/* =========================================================
   GOOGLE MAPS
   ========================================================= */

const mapsBtn = document.getElementById("mapsBtn");

if (mapsBtn) {
  mapsBtn.addEventListener("click", () => {

    const config = loadWeddingConfig();

    const venue =
      config.venue || "Pendopo Mataram";

    const city =
      config.city || "Yogyakarta";

    const query =
      encodeURIComponent(
        `${venue}, ${city}`
      );

    const mapsUrl =
      `https://www.google.com/maps/search/?api=1&query=${query}`;

    window.open(
      mapsUrl,
      "_blank",
      "noopener,noreferrer"
    );

  });
}

/* =========================================================
   CLOSING COUPLE NAME
   ========================================================= */

function updateClosingCouple() {

  const closingCouple =
    document.getElementById("closingCouple");

  if (!closingCouple) return;

  try {

    const saved = window.weddingConfig || {};

    const bride =
      saved.bride || "Alya";

    const groom =
      saved.groom || "Arkan";

    closingCouple.textContent =
      `${bride} & ${groom}`;

  } catch (error) {

    console.log(
      "Data nama mempelai belum tersedia."
    );

  }
}

updateClosingCouple();

/* =========================================================
   WEDDING MAP - SYNC DARI ADMIN
   ========================================================= */

function updateWeddingMap() {

 const config = window.weddingConfig || {};

  const venue =
    config.venue || "Pendopo Mataram";

  const city =
    config.city || "Yogyakarta";

  const mapsUrl =
    config.mapsUrl || "";

  const mapVenueName =
    document.getElementById("mapVenueName");

  const mapCityName =
    document.getElementById("mapCityName");

  const weddingMap =
    document.getElementById("weddingMap");

  const mapsBtn =
    document.getElementById("mapsBtn");


  /* =========================
     NAMA VENUE
     ========================= */

  if (mapVenueName) {
    mapVenueName.textContent = venue;
  }

  if (mapCityName) {
    mapCityName.textContent = city;
  }


  /* =========================
     TOMBOL GOOGLE MAPS
     ========================= */

  if (mapsBtn) {

    mapsBtn.onclick = function () {

      const destination =
        mapsUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          `${venue}, ${city}`
        )}`;

      window.open(
        destination,
        "_blank",
        "noopener,noreferrer"
      );

    };

  }


  /* =========================
     MAP DI DALAM WEBSITE
     ========================= */

  if (weddingMap) {

    /*
      Jika Admin memasukkan URL Google Maps Embed,
      gunakan URL tersebut langsung.
    */

    if (
      mapsUrl &&
      mapsUrl.includes("google.com/maps/embed")
    ) {

      weddingMap.src = mapsUrl;

    }

    /*
      Jika Admin memasukkan URL Google Maps biasa,
      gunakan venue + kota sebagai lokasi iframe.
    */

    else {

      weddingMap.src =
        `https://www.google.com/maps?q=${encodeURIComponent(
          `${venue}, ${city}`
        )}&output=embed`;

    }

  }

}

updateWeddingMap();

/* =========================================================
   LOAD GALLERY PHOTOS
   ========================================================= */

const GALLERY_DB_NAME = "weddingGalleryDB";
const GALLERY_STORE_NAME = "photos";


function openGalleryDB() {

  return new Promise((resolve, reject) => {

    const request =
      indexedDB.open(GALLERY_DB_NAME, 1);

    request.onupgradeneeded = function () {

      const db = request.result;

      if (!db.objectStoreNames.contains(GALLERY_STORE_NAME)) {

        db.createObjectStore(
          GALLERY_STORE_NAME
        );

      }

    };

    request.onsuccess = function () {
      resolve(request.result);
    };

    request.onerror = function () {
      reject(request.error);
    };

  });

}


async function loadGalleryPhotos() {

  const db =
    await openGalleryDB();


  for (let i = 1; i <= 4; i++) {

    const photo =
      await new Promise(
        (resolve, reject) => {

          const transaction =
            db.transaction(
              GALLERY_STORE_NAME,
              "readonly"
            );

          const store =
            transaction.objectStore(
              GALLERY_STORE_NAME
            );

          const request =
            store.get(String(i));


          request.onsuccess = () => {
            resolve(
              request.result || null
            );
          };


          request.onerror = () => {
            reject(request.error);
          };

        }
      );


    if (!photo) continue;


    const image =
      document.querySelector(
        `.gallery-item[data-gallery="${i - 1}"] img`
      );


    if (!image) continue;


    const imageUrl =
      URL.createObjectURL(photo);


    image.src = imageUrl;

  }

}


loadGalleryPhotos();

/* =========================================================
   WEDDING MUSIC
   ========================================================= */

const musicBtn =
  document.getElementById("musicBtn");

const weddingAudio =
  document.getElementById("weddingAudio");


let musicPlaying = false;


if (musicBtn && weddingAudio) {

  musicBtn.addEventListener(
    "click",
    async function () {

      try {

        if (musicPlaying) {

          weddingAudio.pause();

          musicPlaying = false;

          musicBtn.classList.remove("playing");

          musicBtn.textContent = "♫";

        } else {

          await weddingAudio.play();

          musicPlaying = true;

          musicBtn.classList.add("playing");

          musicBtn.textContent = "❚❚";

        }

      } catch (error) {

        console.error(
          "Musik tidak dapat diputar:",
          error
        );

      }

    }
  );

}

/* =========================================================
   LOAD CLOUDINARY GALLERY
   ========================================================= */

async function loadCloudinaryGallery() {

  try {

    const response = await fetch(
      `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/tables/wedding_gallery/rows/main`,
      {
        method: "GET",
        headers: {
          "X-Appwrite-Project": APPWRITE_PROJECT_ID
        }
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Appwrite Gallery GET error:", result);
      return;
    }

    const gallery = result;

    console.log("Gallery dari Appwrite:", gallery);

    for (let i = 1; i <= 4; i++) {

      const image = document.querySelector(
        `.gallery-photo[data-gallery="${i - 1}"] img`
      );

      const url = gallery[`photo${i}`];

      if (!image || !url) {
        continue;
      }

      image.src = url;

      image.onerror = function () {
        console.error(
          `Foto gallery ${i} gagal dimuat:`,
          url
        );
      };

    }

  } catch (error) {

    console.error(
      "Gagal mengambil gallery dari Appwrite:",
      error
    );

  }

}