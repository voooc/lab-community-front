<template>
    <Detail :api="GetSingleNews" />
</template>
<script setup lang="ts">
    import Detail from './components/index.vue';
    import { GetSingleNews } from '@/api/news/index';
</script>
