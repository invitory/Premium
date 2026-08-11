function getRsvp(){return JSON.parse(localStorage.getItem("demo_rsvp")||"[]")}
function renderRsvp(){
 const data=getRsvp(), table=document.getElementById("rsvpTable");
 if(!data.length){table.innerHTML='<p class="muted">Belum ada RSVP demo.</p>'}
 else{
  table.innerHTML='<table class="table"><thead><tr><th>Nama</th><th>Status</th><th>Jumlah</th><th>Ucapan</th></tr></thead><tbody>'+
  data.map(x=>`<tr><td>${escapeHtml(x.name)}</td><td>${escapeHtml(x.attendance)}</td><td>${x.count}</td><td>${escapeHtml(x.message||"-")}</td></tr>`).join("")+
  '</tbody></table>';
 }
 document.getElementById("statGuests").textContent=data.reduce((a,x)=>a+Number(x.count||1),0);
 document.getElementById("statAttend").textContent=data.filter(x=>x.attendance==="Hadir").reduce((a,x)=>a+Number(x.count||1),0);
 document.getElementById("statAbsent").textContent=data.filter(x=>x.attendance==="Tidak hadir").reduce((a,x)=>a+Number(x.count||1),0);
 document.getElementById("statMessages").textContent=data.filter(x=>x.message).length;
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function loadConfigToForm(){try{const c=JSON.parse(localStorage.getItem("demo_config")||"null");if(!c)return;Object.entries(c).forEach(([id,value])=>{const el=document.getElementById(id);if(el&&value!=null)el.value=value})}catch{}}
document.getElementById("saveBtn").addEventListener("click",()=>{const val=id=>document.getElementById(id)?.value.trim()||"";const cfg={bride:val("bride")||"Alya",groom:val("groom")||"Arkan",weddingDate:document.getElementById("weddingDate").value||"2026-09-11",venue:val("venue")||"Pendopo Mataram",city:val("city")||"Yogyakarta",akadTime:val("akadTime")||"09:00 WIB",receptionTime:val("receptionTime")||"19:00 WIB",mapsUrl:val("mapsUrl"),bankName:val("bankName")||"BANK BCA",bankAccount:val("bankAccount")||"1234567890",bankHolder:val("bankHolder")||"Alya & Arkan"};localStorage.setItem("demo_config",JSON.stringify(cfg));toast("Perubahan disimpan ✓");});
document.getElementById("clearRsvp").addEventListener("click",()=>{if(confirm("Hapus semua RSVP demo?")){localStorage.removeItem("demo_rsvp");loadConfigToForm();
renderRsvp();toast("Data demo dihapus")}})
function toast(t){const x=document.getElementById("adminToast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2000)}
renderRsvp();

/* =========================================================
   GALLERY LOCAL STORAGE
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


async function saveGalleryPhoto(number, file) {

  const db = await openGalleryDB();

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        GALLERY_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        GALLERY_STORE_NAME
      );

    store.put(file, String(number));

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

  });

}


async function getGalleryPhoto(number) {

  const db = await openGalleryDB();

  return new Promise((resolve, reject) => {

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
      store.get(String(number));

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject(request.error);
    };

  });

}


async function deleteGalleryPhoto(number) {

  const db = await openGalleryDB();

  return new Promise((resolve, reject) => {

    const transaction =
      db.transaction(
        GALLERY_STORE_NAME,
        "readwrite"
      );

    const store =
      transaction.objectStore(
        GALLERY_STORE_NAME
      );

    store.delete(String(number));

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

  });

}


/* =========================================================
   SETUP UPLOAD
   ========================================================= */

function setupGalleryUpload() {

  for (let i = 1; i <= 4; i++) {

    const input =
      document.getElementById(`gallery${i}`);

    const preview =
      document.getElementById(`preview${i}`);

    if (!input || !preview) continue;


    /* PILIH FOTO */

    input.addEventListener(
      "change",
      async function () {

        const file = this.files[0];

        if (!file) return;


        if (!file.type.startsWith("image/")) {

          alert("Silakan pilih file gambar.");

          this.value = "";

          return;

        }


        try {

          await saveGalleryPhoto(
            i,
            file
          );


          const imageUrl =
            URL.createObjectURL(file);


          preview.innerHTML = `
            <img
              src="${imageUrl}"
              alt="Foto ${i}"
            />
          `;


          toast(
            `Foto ${i} berhasil dipilih ✓`
          );


        } catch (error) {

          console.error(error);

          alert(
            "Foto gagal disimpan."
          );

        }

      }
    );

  }


  /* HAPUS FOTO */

  document
    .querySelectorAll(".remove-photo")
    .forEach(button => {

      button.addEventListener(
        "click",
        async function () {

          const number =
            this.dataset.photo;


          await deleteGalleryPhoto(
            number
          );


          const input =
            document.getElementById(
              `gallery${number}`
            );

          const preview =
            document.getElementById(
              `preview${number}`
            );


          if (input) {
            input.value = "";
          }


          if (preview) {

            preview.innerHTML =
              `<span>0${number}</span>`;

          }


          toast(
            `Foto ${number} dihapus`
          );

        }
      );

    });

}


setupGalleryUpload();