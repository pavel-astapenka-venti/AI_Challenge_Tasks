<template>
    <svg :width="size" :height="size" viewBox="0 0 2048 2048">
        <path fill="currentColor"
            d="m1115 1024l914 915l-90 90l-915-914l-915 914l-90-90l914-915L19 109l90-90l915 914l915-914l90 90z" />
    </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 14 })
</script>
