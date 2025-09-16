<script setup lang="ts">
import { Buffer } from "buffer";
import { LucideImage, LucideFileText } from "lucide-vue-next";
defineProps<{
  attachments: EmlAttachment[];
}>();

const getFileSize = (attachment: EmlAttachment) => {
  let size = 0;
  if (!attachment.data) return "0";
  size = Number((Buffer.from(attachment.data).length / 1024).toFixed(2));
  if (size > 1024) {
    return (size / 1024).toFixed(2) + " MB";
  }
  return size.toFixed(2) + " KB";
};

const getAttachmentIcon = (attachment: EmlAttachment) => {
  if (attachment.contentType?.startsWith("image/")) {
    return LucideImage;
  } else if (attachment.contentType?.startsWith("application/pdf")) {
    return LucideFileText;
  }
  // Add more conditions for different file types if needed
  return LucideFileText;
};
</script>
<template>
  <div class="!mb-4">
    <h3 class="!font-bold !text-xl">Attachments</h3>
    <div class="!flex !gap-2 !flex-wrap">
      <a
        v-for="(attachment, index) in attachments"
        :key="index"
        class="!p-4 !border !rounded !border-slate-400/60 !flex !min-w-32 !max-w-48 !overflow-hidden !gap-2"
        :href="`data:${attachment.contentType};base64,${Buffer.from(
          attachment.data
        ).toString('base64')}`"
        :download="attachment.name || `attachment-${index + 1}`"
      >
        <div>
          <component :is="getAttachmentIcon(attachment)" />
        </div>
        <div>
          <h4 class="!font-bold !text-sm !line-clamp-1">
            {{ attachment.name || `Attachment ${index + 1}` }}
          </h4>
          <p class="!text-sm !text-slate-500">
            Size:
            {{ getFileSize(attachment) }}
          </p>
        </div>
        <!-- <template v-if="attachment.contentType?.startsWith('image/')">
          <img
            :src="`data:${attachment.contentType};base64,${Buffer.from(
              attachment.data
            ).toString('base64')}`"
            :alt="attachment.name || 'Attachment Image'"
          />
        </template>
        <a
          v-else
          :href="`data:${attachment.contentType};base64,${Buffer.from(
            attachment.data
          ).toString('base64')}`"
          :download="attachment.name || `attachment-${index + 1}`"
          class="!bg-gradient-to-b !from-slate-700 !to-slate-600 !rounded !px-2 !py-1 !text-white !mb-4 !font-medium !border-b-slate-500 !border-b !inline-block !mt-2"
        >
          Download
        </a> -->
      </a>
    </div>
  </div>
</template>
