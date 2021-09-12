<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let min = 0;
  export let max = 100;
  export let step = 2;
  export let current = 3;
  let sliding = false;
  let slider;
  let scale;
  let clientWidth;

  $: scale = clientWidth / (max / step);

  $: dispatch("change", { value: current });

  function handleMouseMove(e) {
    if (sliding) {
      const distance = e.clientX - slider.getBoundingClientRect().left;
      const value = Math.round(distance / scale) * step;
      current = Math.max(Math.min(value, max), min);
    }
  }

  function handleMouseDown(e) {
    sliding = true;
    const distance = e.clientX - slider.getBoundingClientRect().left;
    const value = Math.round(distance / scale) * step;
    current = value;
  }

  function handleKeydown(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextValue = current - step;
      current = Math.max(nextValue, min);
    } else if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      const nextValue = current + step;
      current = Math.min(nextValue, max);
    }
  }

  function handleMouseup(e) {
    sliding = false;
  }
</script>

<svelte:body
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseup}
  on:mouseleave={handleMouseup} />
<div
  tabindex="0"
  bind:clientWidth
  aria-valuemax={max}
  aria-valuemin={min}
  aria-valuenow={current}
  aira-orientation="horizontal"
  role="slider"
  bind:this={slider}
  class="slider"
  on:mousedown={handleMouseDown}
  on:keydown={handleKeydown}
>
  <div class="rail">
    <div class="ball" style="left: calc({(current / max) * 100}% - 8.5px)" />
    <div class="fill" style="transform: scaleX({current / max})" />
  </div>
</div>

<style>
  .slider {
    position: relative;
    width: 250px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .rail {
    width: 100%;
    height: 8px;
    background-color: #eaeaea;
    border-radius: 8px;
    overflow: hidden;
  }

  .fill {
    width: 100%;
    height: 8px;
    background-color: #f67e7d;
    transform-origin: left;
    transform: scaleX(0);
  }

  .ball {
    position: absolute;
    z-index: 2;
    top: calc(50% - 8.5px);
    left: -3px;
    width: 17px;
    height: 17px;
    border-radius: 50%;
    background-color: #843b62;
  }
</style>
