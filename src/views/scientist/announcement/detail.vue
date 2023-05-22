<template>
    <Detail :api="GetSingleAnnouncement" />
</template>
<script setup lang="ts">
    import Detail from '@/views/news/components/index.vue';
    import { GetSingleAnnouncement } from '@/api/news/index';
</script>
