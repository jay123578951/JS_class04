// 全域註冊元件
// html 標籤可寫 pagination 或是 is="pagination"
Vue.component('pagination',{
  template: `<nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled': pages.current_page === 1}">
        <a class="page-link" href="#" aria-label="Previous" @click.prevent="emitPages(pages.current_page - 1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li v-for="(item, index) in pages.total_pages" :key="index" class="page-item" :class="{'active': item === pages.current_page}">
        <a class="page-link" href="#" @click.prevent="emitPages(item)">{{ item }}</a>
      </li>
      <li class="page-item" :class="{'disabled': pages.current_page === pages.total_pages}">
        <a class="page-link" href="#" aria-label="Next" @click.prevent="emitPages(pages.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>`,

  // 元件本身的 data，但這邊不會使用
  // 元件內層所有的 data 都必須使用 function return
  data() {
    return {
    };
  },

  // props 由外而內取得 getProducts 的資料放入空物件內
  // 拿到資料後再去再去判斷 pagination 元件內的條件
  props: {
    pages: {}, // props 的名稱為 pages，html 寫成 :pages＝"值"，例 :pages="pagination"
  },
  methods: {
    // emit 由內而外以事件的形式傳遞
    // emitPages 函式帶 item 參數
    emitPages(item) {
      // 透過 emit 由內向外傳遞點擊的分頁事件 @click.prevent="emitPages(item)" 觸發外層的 @emit-pages="getProducts" 來執行 getProducts()
      // 例如下一頁：@click.prevent="emitPages(pages.current_page + 1)"
      this.$emit('emit-pages', item); // emit 名稱為 emit-pages，html 寫成 @emit-pages=""
    },
  },
  
});