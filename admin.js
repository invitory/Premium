/* =========================================================
   APPWRITE CONFIG
   ========================================================= */

const APPWRITE_ENDPOINT = "https://sgp.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "b31350025fd82af3a";

const APPWRITE_DATABASE_ID = "database-6a7";

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
    console.error("Appwrite GET error:", result);
    throw new Error(
      result.message || "Gagal mengambil data dari Appwrite."
    );
  }

  return result;
}

async function saveWeddingConfig(cfg) {
  const response = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/tables/${APPWRITE_TABLE_ID}/rows/${APPWRITE_DOCUMENT_ID}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": APPWRITE_PROJECT_ID
      },
      body: JSON.stringify({
        data: cfg
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Appwrite SAVE error:", result);
    throw new Error(
      result.message || "Gagal menyimpan data ke Appwrite."
    );
  }

  return result;
}

async function getWeddingGallery() {
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
    console.error("Appwrite GALLERY GET error:", result);
    throw new Error(
      result.message || "Gagal mengambil gallery dari Appwrite."
    );
  }

  return result;
}

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
document.getElementById("saveBtn").addEventListener("click", async () => {

  const val = id =>
    document.getElementById(id)?.value.trim() || "";

  const cfg = {
    bride: val("bride") || "Alya",
    groom: val("groom") || "Arkan",
    weddingDate:
      document.getElementById("weddingDate").value ||
      "2026-09-11",

    venue: val("venue") || "Pendopo Mataram",
    city: val("city") || "Yogyakarta",
    akadTime: val("akadTime") || "09:00 WIB",
    receptionTime: val("receptionTime") || "19:00 WIB",
    mapsUrl: val("mapsUrl"),

    bankName: val("bankName") || "BANK BCA",
    bankAccount: val("bankAccount") || "1234567890",
    bankHolder: val("bankHolder") || "Alya & Arkan"
  };

  try {

    await saveWeddingConfig(cfg);


async function saveWeddingGallery(gallery) {
  const response = await fetch(
    `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/tables/wedding_gallery/rows/main`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": APPWRITE_PROJECT_ID
      },
      body: JSON.stringify({
        data: {
          photo1: gallery.photo1 || "",
          photo2: gallery.photo2 || "",
          photo3: gallery.photo3 || "",
          photo4: gallery.photo4 || ""
        }
      })
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("Appwrite GALLERY SAVE error:", result);
    throw new Error(
      result.message || "Gagal menyimpan gallery ke Appwrite."
    );
  }

  return result;
}

    // Backup lokal sementara
    localStorage.setItem(
      "demo_config",
      JSON.stringify(cfg)
    );

    toast("Perubahan berhasil disimpan ✓");

  } catch (error) {

    console.error(error);

    toast("Gagal menyimpan ❌");

    alert(
      "Gagal menyimpan ke database:\n\n" +
      error.message
    );

  }

});

document.getElementById("clearRsvp").addEventListener("click",()=>{if(confirm("Hapus semua RSVP demo?")){localStorage.removeItem("demo_rsvp");loadConfigToForm();
renderRsvp();toast("Data demo dihapus")}})
function toast(t){const x=document.getElementById("adminToast");x.textContent=t;x.classList.add("show");setTimeout(()=>x.classList.remove("show"),2000)}
renderRsvp();


/* =========================================================
   CLOUDINARY GALLERY UPLOAD
   ========================================================= */

const CLOUDINARY_CLOUD_NAME = "ecojr2tw";
const CLOUDINARY_UPLOAD_PRESET = "Premium gallery";

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


/* =========================================================
   UPLOAD FOTO
   ========================================================= */

async function setupGalleryUpload() {

    let gallery = {};

    try {
        const result = await getWeddingGallery();

        gallery = {
            photo1: result.photo1 || "",
            photo2: result.photo2 || "",
            photo3: result.photo3 || "",
            photo4: result.photo4 || ""
        };

    } catch (error) {
        console.error("Gagal mengambil gallery:", error);
    }


    // Tampilkan foto yang sudah tersimpan
    for (let i = 1; i <= 4; i++) {

        const input = document.getElementById(`gallery${i}`);
        const preview = document.getElementById(`preview${i}`);

        if (!input || !preview) {
            continue;
        }

        const imageUrl = gallery[`photo${i}`];

        if (imageUrl) {
            preview.innerHTML = `
                <img
                    src="${imageUrl}"
                    alt="Foto ${i}"
                >
            `;
        }


        // Ketika admin memilih foto
        input.addEventListener("change", function () {

            const file = this.files[0];

            if (!file) return;

            uploadGalleryPhoto(i, file);

        });

    }


    // Tombol hapus
    document
        .querySelectorAll(".remove-photo")
        .forEach(button => {

            button.addEventListener("click", async function () {

                const number = this.dataset.photo;

                try {

                    const currentGallery = await getWeddingGallery();

                    const gallery = {
                        photo1: currentGallery.photo1 || "",
                        photo2: currentGallery.photo2 || "",
                        photo3: currentGallery.photo3 || "",
                        photo4: currentGallery.photo4 || ""
                    };

                    gallery[`photo${number}`] = "";

                    await saveWeddingGallery(gallery);

                    const input =
                        document.getElementById(`gallery${number}`);

                    const preview =
                        document.getElementById(`preview${number}`);

                    if (input) {
                        input.value = "";
                    }

                    if (preview) {
                        preview.innerHTML = `<span>0${number}</span>`;
                    }

                    toast(`Foto ${number} dihapus`);

                } catch (error) {

                    console.error(error);

                    alert(
                        "Gagal menghapus foto dari Appwrite:\n\n" +
                        error.message
                    );

                }

            });

        });

}


/* =========================================================
   SETUP INPUT FOTO
   ========================================================= */

function setupGalleryUpload() {

  /*
    Tampilkan foto yang sudah tersimpan
  */

  let gallery = {};

  try {

    gallery =
      JSON.parse(
        localStorage.getItem(
          "wedding_gallery"
        ) || "{}"
      );

  } catch {

    gallery = {};

  }


  for (let i = 1; i <= 4; i++) {

    const input =
      document.getElementById(
        `gallery${i}`
      );

    const preview =
      document.getElementById(
        `preview${i}`
      );


    if (!input || !preview) {
      continue;
    }


    /*
      Load foto sebelumnya
    */

    if (gallery[i]) {

      preview.innerHTML = `
        <img
          src="${gallery[i]}"
          alt="Foto ${i}"
        >
      `;

    }


    /*
      Ketika admin memilih foto
    */

    input.addEventListener(
      "change",
      function () {

        const file =
          this.files[0];

        if (!file) return;

        uploadGalleryPhoto(
          i,
          file
        );

      }
    );

  }


  /*
    Tombol hapus
  */

  document
    .querySelectorAll(".remove-photo")
    .forEach(button => {

      button.addEventListener(
        "click",
        function () {

          const number =
            this.dataset.photo;


          const gallery =
            JSON.parse(
              localStorage.getItem(
                "wedding_gallery"
              ) || "{}"
            );


          delete gallery[number];


          localStorage.setItem(
            "wedding_gallery",
            JSON.stringify(gallery)
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
console.log("CLOUDINARY GALLERY AKTIF");