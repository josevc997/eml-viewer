<script lang="ts" setup>
import { Buffer } from "buffer";

const data = ref<null | EmlReadedUpdated>(null);
const emlFileInput = ref<HTMLInputElement | null>(null);

const readingFile = ref(false);
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  readingFile.value = true;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target && typeof e.target.result === "string") {
        $fetch<EmlReadedUpdated>("/api/eml-parse", {
          method: "POST",
          body: { data: e.target.result },
        })
          .then((response: EmlReadedUpdated) => {
            data.value = response;
          })
          .finally(() => {
            readingFile.value = false;
          });
      }
    };
    reader.readAsText(file);
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    if (emlFileInput.value) {
      // Set the file input's files property (not possible directly), so call handler manually
      handleFileChange({ target: { files: [file] } } as any as Event);
    }
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const triggerFileInput = () => {
  emlFileInput.value?.click();
};

const clearEml = () => {
  data.value = null;
  if (emlFileInput.value) {
    emlFileInput.value.value = "";
  }
};
</script>
<template>
  <main class="!mx-auto !max-w-5xl">
    <h1 class="!text-3xl !font-bold !mb-4">EML VIEWER</h1>
    <form v-if="!data" action="">
      <div
        class="!relative !email-body !border-2 !rounded !border-slate-400/60 !p-6 !border-dashed !mb-4 *:!leading-none !flex !justify-center !cursor-pointer"
        id="dropZone"
        @click="triggerFileInput"
        @drop="handleDrop"
        @dragover="handleDragOver"
      >
        <div v-if="!readingFile" class="!flex !flex-col !w-fit !gap-2">
          <div class="!flex !gap-4">
            <div
              class="!shadow-lg !px-2 !flex !items-center !outline-2 !outline-slate-400/10"
            >
              <icon-envelope class="!text-slate-600" />
            </div>
            <div>
              <p class="!font-bold !text-2xl">Drag & Drop</p>
              <p class="!font-semibold !text-lg">.EML</p>
            </div>
          </div>
          <p
            class="!bg-gradient-to-b !from-slate-700 !to-slate-600 !rounded !px-2 !py-1 !text-white !mb-4 !font-medium !border-b-slate-500 !border-b !text-center"
          >
            Or click to choose a file
          </p>
        </div>
        <div v-else class="!flex !flex-col !w-fit !gap-2">
          <icon-loading class="!animate-spin !text-slate-600 !text-7xl" />
          <p class="!font-semibold !text-slate-600">Cargando...</p>
        </div>
      </div>
      <input
        ref="emlFileInput"
        type="file"
        name="emlFile"
        id="emlFile"
        class="!sr-only"
        @change="handleFileChange"
        accept=".eml"
      />
    </form>
    <h2 class="!text-xl !font-bold">{{ data?.subject }}</h2>
    <p v-if="data" class="!mb-4">
      From: {{ data?.from.name }} <{{ data?.from.email }}><br />
      <template v-if="Array.isArray(data?.to)">
        To names:
        <template v-for="to in data?.to">
          {{
            to.name ||
            (to.email && to.email.includes("<") ? to.email.split("<")[0] : "")
          }}, </template
        ><br />
        To emails:
        <template v-for="to in data?.to">
          <span class="!underline !text-blue-500">{{
            to.email && to.email.includes("<")
              ? to.email.split("<")[1]?.slice(0, -1)
              : to.email
          }}</span
          >, </template
        ><br />
      </template>
      <template v-else> To: {{ data?.to.email }}<br /> </template>
      Date: {{ data?.date }}
    </p>
    <button
      v-if="data"
      @click="clearEml"
      class="!bg-gradient-to-b !from-slate-700 !to-slate-600 !rounded !px-2 !py-1 !text-white !mb-4 !font-medium !border-b-slate-500 !border-b !text-center !cursor-pointer"
    >
      clear
    </button>
    <attachment-section v-if="data?.attachments?.length" :attachments="data?.attachments" />
    <div
      class="!relative !email-body !border !rounded !border-slate-400/60 !p-6 overflow-x-auto"
      v-if="data && data.bodyHtml"
    >
      <div>
        <div v-html="data.bodyHtml" />
      </div>
    </div>
    <div class="!gap-4 !grid !grid-cols-1 !text-slate-600 !mt-6">
      <p>
        EML VIEWER es una herramienta web diseñada para que usuarios puedan
        subir archivos con extensión .eml y ver de forma clara y transparente su
        contenido. Un archivo EML guarda todo lo que compone un correo
        electrónico: encabezados (“headers”) como remitente, destinatario,
        asunto, fecha y hora; el cuerpo del mensaje en texto plano o en HTML; y
        también los archivos adjuntos que acompañaban al correo. Con EML VIEWER
        no necesitas un cliente de correo electrónico instalado — basta con
        subir el archivo para que la aplicación lo procese, lo muestre
        estructurado y permita visualizar el mensaje completo, sus meta-datos y
        los adjuntos en su forma original.
      </p>
      <p>
        Además, esta web está pensada para quienes necesitan revisar correos
        guardados, ya sea para archivar, para auditorías, para recuperación de
        información, o simplemente para leer mensajes exportados de servicios de
        correo. El visor permite distinguir entre la vista en texto plano y la
        vista en HTML, revisar los detalles técnicos (como el camino que siguió
        el mensaje, autenticaciones, pasajes MIME, etc.), y extraer o descargar
        los archivos adjuntos incluidos. EML VIEWER convierte lo que puede ser
        un archivo difícil de interpretar en una lectura ordenada y accesible,
        manteniendo la máxima fidelidad al correo original.
      </p>
    </div>
  </main>
</template>
