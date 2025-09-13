<script lang="ts" setup>
import { Buffer } from "buffer";

const data = ref<null | EmlReadedUpdated>(null);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
      if (e.target && typeof e.target.result === "string") {
        $fetch<EmlReadedUpdated>("/api/eml-parse", {
          method: "POST",
          body: { data: e.target.result },
        }).then((response: EmlReadedUpdated) => {
          data.value = response;
        });
      }
    };
    reader.readAsText(file);
  }
};
</script>
<template>
  <main class="mx-auto max-w-5xl">
    <h1 class="text-3xl font-bold mb-4">EML VIEWER</h1>
    <form action="" class="flex">
      <label
        for="emlFile"
        class="bg-gradient-to-b from-blue-700 to-blue-600 rounded px-2 py-1 text-white mb-4 font-medium border-b-blue-500 border-b"
      >
        change eml
      </label>
      <input
        type="file"
        name="emlFile"
        id="emlFile"
        class="sr-only"
        @change="handleFileChange"
      />
    </form>
    <h2 class="text-xl font-bold">{{ data?.subject }}</h2>
    <p v-if="data" class="mb-4">
      From: {{ data?.from.name }} <{{ data?.from.email }}><br />
      To names: <template v-for="to in data?.to">
        {{ to.name || to.email.split('<')[0] }}, 
      </template><br />
      To emails: <template v-for="to in data?.to">
        <span class="underline text-blue-500">{{ to.email.split('<')[1]?.slice(0, -1) || to.email }}</span>,  
      </template><br />
      Date: {{ data?.date }}
    </p>
    <div>
      <div
        v-if="data && data.bodyHtml"
        class="relative email-body border rounded border-slate-400/60 p-6"
      >
        <h v-html="data.bodyHtml"></h>
      </div>
    </div>
    <div
      v-for="(attachment, index) in data?.attachments"
      :key="index"
      class="mt-6 p-4 border rounded border-slate-400/60"
    >
      <h2>{{ attachment.name || `Attachment ${index + 1}` }}</h2>
      <template
        v-if="
          attachment.contentType?.startsWith('image/')
        "
      >
        <img
          :src="`data:${attachment.contentType};base64,${Buffer.from(
            attachment.data
          ).toString('base64')}`"
          :alt="attachment.name || 'Attachment Image'"
        />
      </template>
            <a
            v-else
              :href="`data:${attachment.contentType};base64,${Buffer.from(attachment.data).toString('base64')}`"
              :download="attachment.name || `attachment-${index + 1}`"
              class="bg-gradient-to-b from-slate-700 to-slate-600 rounded px-2 py-1 text-white mb-4 font-medium border-b-slate-500 border-b inline-block mt-2"
            >
              Download
            </a>
    </div>
    <!-- <pre>
      {{emlFile}}
    </pre> -->
  </main>
</template>
