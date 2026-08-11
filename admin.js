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
   CLOUDINARY GALLERY UPLOAD
   ========================================================= */

const CLOUDINARY_CLOUD_NAME = "ecojr2tw";
const CLOUDINARY_UPLOAD_PRESET = "Premium gallery";

const CLOUDINARY_UPLOAD_URL =
  `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;


/* =========================================================
   UPLOAD FOTO
   ========================================================= */

async function uploadGalleryPhoto(number, file) {

  if (!file) return;


  if (!file.type.startsWith("image/")) {

    alert("Silakan pilih file gambar.");

    return;

  }


  const preview =
    document.getElementById(
      `preview${number}`
    );


  if (preview) {

    preview.innerHTML = `
      <span>Mengupload foto...</span>
    `;

  }


  try {

    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );


    const response =
      await fetch(
        CLOUDINARY_UPLOAD_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      console.error(
        "Cloudinary error:",
        result
      );

      throw new Error(
        result.error?.message ||
        "Upload gagal."
      );

    }


    /*
      URL gambar dari Cloudinary
    */

    const imageUrl =
      result.secure_url;


    /*
      Simpan URL foto
      ke konfigurasi gallery
    */

    const gallery =
      JSON.parse(
        localStorage.getItem(
          "wedding_gallery"
        ) || "{}"
      );


    gallery[number] =
      imageUrl;


    localStorage.setItem(
      "wedding_gallery",
      JSON.stringify(gallery)
    );


    /*
      Tampilkan preview
    */

    if (preview) {

      preview.innerHTML = `
        <img
          src="${imageUrl}"
          alt="Foto ${number}"
        >
      `;

    }


    toast(
      `Foto ${number} berhasil diupload ✓`
    );


  } catch (error) {

    console.error(error);


    if (preview) {

      preview.innerHTML =
        `<span>Upload gagal</span>`;

    }


    alert(
      `Upload gagal: ${error.message}`
    );

  }

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