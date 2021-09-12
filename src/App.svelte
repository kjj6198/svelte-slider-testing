<script>
  import debounce from "./debounce";
  import Slider from "./Slider.svelte";

  let perPage = 5;

  const callAPI = () =>
    fetch(
      `https://api.github.com/search/repositories?q=svelte&per_page=${perPage}`
    ).then((res) => {
      if (!res.ok) {
        throw new Error(`err: ${res.statusText}`);
      }

      return res.json();
    });
  let response = callAPI();
  const debouncedChange = debounce((e) => {
    response = callAPI();
  }, 1000);
</script>

<h2>列表數: {perPage}</h2>
<Slider
  min={1}
  max={30}
  step={1}
  current={perPage}
  on:change={(e) => {
    perPage = e.detail.value;
    debouncedChange();
  }}
/>

{#if response}
  {#await response}
    <span>API 載入中</span>
  {:then data}
    <h3>搜尋結果</h3>
    {#each data.items as item (item.id)}
      <div class="search-result">
        <h3>{item.full_name}</h3>
        <p>{item.description}</p>
        <div class="metainfo">
          <ul>
            <li>Forks: {item.forks}</li>
            <li>Issues: {item.open_issues}</li>
          </ul>
        </div>
        <a href={item.html_url} title={item.full_name}>連結</a>
      </div>
    {/each}
  {:catch err}
    <p>{err.message}</p>
  {/await}
{/if}
