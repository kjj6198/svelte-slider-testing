<script>
  import { onMount } from "svelte";
  import Slider from "../Slider.svelte";

  export let onChange;
  export let value;
  onMount(() => {
    setTimeout(() => {
      value = 20;
    }, 1000);
  });
</script>

<Slider max={100} min={0} step={1} current={value} on:change={onChange} />
