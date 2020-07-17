new Vue ({

  el: '#app',
  data: {
    products: [],
    pagination: {},
    tempProduct: {
      imageUrl: [],
    },
    isNew: false,
    status: {
      fileUploading: false,
    },
    user: {
      token: '',
      uuid: '8cc5a81d-e152-435e-9536-f56254d0ab7a',
    },
  },

  created() {
    // 取得 token 的 cookies
    this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 判斷有沒有 token，防止直接從連結進來的使用者，若沒有 token 則返回登入頁
    if (this.user.token === '') {
      window.location = 'Login.html';
    }
    // 獲取全部的產品
    this.getProducts();
  },

  methods: {
    getProducts(page = 1) {
      // 獲取產品第一頁的 api
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;
      // 預設帶入 token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
      // 執行 get 請求
      axios.get(api)
      .then((res) => {
        this.products = res.data.data; // 取得產品列表
        this.pagination = res.data.meta.pagination; // 取得分頁資訊
      });
    },

    openModal(isNew, item) {
      switch (isNew) {
        case 'new':
          // 新增之前必須先清除原有可能暫存的資料
          this.tempProduct = {
            imageUrl: [],
          };
          // true 代表新增
          this.isNew = true;
          $('#productModal').modal('show');
          break;
        case 'edit':
          // 取得該產品資料
          this.getProduct(item.id);
          // false 代表編輯
          this.isNew = false;
          break;
        case 'delete':
          // 使用淺拷貝至 tempProduct
          this.tempProduct = Object.assign({}, item);
          $('#delProductModal').modal('show');
          break;
        default:
          break;
      }
    },
    getProduct(id) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
      axios.get(api)
        .then((res) => {
          // 取得 data.data 產品資料後，傳到 tempProduct
          this.tempProduct = res.data.data;
          $('#productModal').modal('show');
        })
        .catch((error) => {
          console.log(error); 
        });
    },
    updateProduct() {
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
      let httpMethod = 'post';
      // 當不是 isNew 新增商品時，則執行 patch 編輯
      if (!this.isNew) {
        api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        httpMethod = 'patch';
      }
      // 預設帶入 token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

      axios[httpMethod](api, this.tempProduct).then(() => {
        $('#productModal').modal('hide');
        this.getProducts(); // 重新取得全部產品資料
      }).catch((error) => {
        console.log(error)
      });
    },
    uploadFile() {
      const uploadedFile = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
      this.status.fileUploading = true;
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((response) => {
        this.status.fileUploading = false;
        if (response.status === 200) {
          this.tempProduct.imageUrl.push(response.data.data.path);
        }
      }).catch(() => {
        console.log('上傳不可超過 2 MB');
        this.status.fileUploading = false;
      });
    },
    delProduct() {
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
      // 預設帶入 token
      axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;

      axios.delete(url).then(() => {
        $('#delProductModal').modal('hide');
        this.getProducts(); // 重新取得全部資料
      });
    },
  }
});