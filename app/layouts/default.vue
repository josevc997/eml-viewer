<template>
    <div>
        <header class="!p-4 !bg-slate-800 !text-white !flex !items-center">
            <img src="/favicon.svg" alt="Logo" class="!size-10 !inline-block !mr-2" />
            <span class="!font-black text-2xl uppercase drop-shadow-lg drop-shadow-slate-700">
                EML Viewer
            </span>
        </header>
        <div class="!py-6 !px-4">
            <slot />
        </div>
    </div>
</template>
