<script lang="ts" setup>

interface IconProps {
  size?: number | string;
}

defineProps<IconProps>();
</script>

<template>
  <svg :height="size" :width="size" fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_5001_83748)">
      <path
        d="M14.6673 7.38723V8.00056C14.6665 9.43818 14.201 10.837 13.3402 11.9884C12.4794 13.1399 11.2695 13.9822 9.89089 14.3898C8.51227 14.7974 7.03882 14.7485 5.6903 14.2503C4.34177 13.7521 3.19042 12.8313 2.40796 11.6253C1.6255 10.4193 1.25385 8.9926 1.34844 7.5581C1.44303 6.1236 1.99879 4.75811 2.93284 3.66528C3.86689 2.57244 5.12917 1.81082 6.53144 1.49399C7.93371 1.17717 9.40083 1.32212 10.714 1.90723M14.6673 2.66723L8.00065 9.34056L6.00065 7.34056"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.4" />
    </g>
    <defs>
      <clipPath id="clip0_5001_83748">
        <rect fill="white" height="16" width="16" />
      </clipPath>
    </defs>
  </svg>

</template>

<style lang="scss" scoped>

</style>
