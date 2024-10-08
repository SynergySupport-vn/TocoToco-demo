jQuery(document).ready(function ($) {
  var order = {
    init() {
      this.refreshCart();
      this.openPopupAddProduct();
      this.openPopupWorkingTime();
      // Sự kiện click đóng banner mb
      jQuery(document).on(
        "click",
        ".mobile-banner .mobile-banner-close-btn",
        this.handleCloseBannerPromotionmb.bind(this)
      );
      // Sự kiện click đóng banner desk
      jQuery(document).on(
        "click",
        ".cart-banner .desk-banner-close-btn",
        this.handleCloseBannerPromotionDesk.bind(this)
      );
      // Thêm sự kiện view list sản phẩm lên google analytics
      googleAnalytics.view_item_list([]);
    },
    /**
     * Close Banner promotion
     * Created by: quang minh
     * 28/02/2023
     */
    handleCloseBannerPromotionmb(e) {
      e.preventDefault();
      // Ẩn Popup trong 1 tiếng nếu người dùng ấn tắt
      common.saveDataWithExpiry("hideMobileBanner", true, 3600);
      jQuery(".mobile-banner").remove();
    },
    handleCloseBannerPromotionDesk(e) {
      e.preventDefault();
      // Ẩn Popup trong 1 tiếng nếu người dùng ấn tắt
      common.saveDataWithExpiry("hideDeskBanner", true, 3600);
      jQuery(".cart-banner").remove();
    },
    
    /**
     * Mở popup thêm sản phẩm
     * Created by: bhtrang
     * 29/12/2020
     */
    handleClickAddProduct(e) {
      var me = this;
      var productEl = $(e.currentTarget);
      var productID = productEl.attr("product_id");
      var defaultVariationID = productEl.attr("default_variation_id");
      // show popup
      var popupHTML = $(`
                          <div class="popup-choose-product">
                            <div class="ss-1 product-infomation">
                              <div class="ss-1-left">
                                <img id="pp-product-img" src="" alt="">
                              </div>
                              <div class="ss-1-right">
                                <div id="pp-product-name" class="product-name">Trà sữa loading...</div>
                                <div class="product-price">
                                  <div id="pp-product-price" class="price">...đ</div>
                                  <div id="pp-product-regular-price" class="regular-price">...đ</div>
                                </div>
                                <div id="pp-product-short-desc" class="product-info">Chưa có thông tin.</div>
                                <div class="wrap-quantity d-flex align-items-center">
                                  <div class="change-quantity-wrap">
                                    <div class="change-quantity decrease">-</div>
                                    <div class="amount">1</div>
                                    <div class="change-quantity increase">+</div>
                                  </div>
                                  <div class="btn-price-product">+ 25,000đ</div>
                                </div>
                              </div>
                            </div>
                            <div class="ss-2 product-customize">
                              <div class="customize-section type">
                                <div class="customize-title">
                                  <div class="left">Chọn loại</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section comboM">
                                <div class="customize-title">
                                  <div class="left">Chọn món size M</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section comboL">
                                <div class="customize-title">
                                  <div class="left">Chọn món size L</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section size">
                                <div class="customize-title">
                                  <div class="left">Chọn size</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section sugar">
                                <div class="customize-title">
                                  <div class="left">Chọn đường</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section ice">
                                <div class="customize-title">
                                  <div class="left">Chọn đá</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                              <div class="customize-section topping">
                                <div class="customize-title">
                                  <div class="left">Chọn topping</div>
                                  <div class="right">
                                    <i class="fas fa-angle-down"></i>
                                  </div>
                                </div>
                                <div class="customize-content">
                                </div>
                              </div>
                            </div>
                          </div>
                        `);
      var productImg = popupHTML.find("#pp-product-img");
      var productName = popupHTML.find("#pp-product-name");
      var productShortDes = popupHTML.find("#pp-product-short-desc");
      var productPrice = popupHTML.find("#pp-product-price");
      var productRegularPrice = popupHTML.find("#pp-product-regular-price");

      common.openPopup(popupHTML, {
        title: "",
        class: "popup-add-product",
        width: 650,
        height: 500,
      });

      // load popup data
      $.ajax({
        // Hàm ajax
        type: "post", //Phương thức truyền post hoặc get
        dataType: "json", //Dạng dữ liệu trả về xml, json, script, or html
        url: AJAX.url, // Nơi xử lý dữ liệu
        data: {
          action: "getProductVariations", //Tên action, dữ liệu gởi lên cho server
          product_id: productID,
          default_variation_id: defaultVariationID,
        },
        beforeSend: function () {
          common.showLoading(".popup-add-product", 0.3);
        },
        success: function (res) {
          common.removeLoading(".popup-add-product");
          if (res.success) {
            var data = res.data;
            var defaultVariation = data.variations.find(
              (variation) =>
                variation.variation_id === data.default_variation_id
            );

            // ProductData gửi google analytics
            var productGA = {
              id: defaultVariation.sku,
              name: data.product_name,
              list_name: "Search Results",
              brand: "Tocotoco",
              category: "",
              variant:
                defaultVariation.attributes.attribute_size +
                "/" +
                defaultVariation.attributes.attribute_type,
              list_position: 1,
              price: defaultVariation.display_price,
            };
            googleAnalytics.view_item([productGA]);

            window.popupData = {
              quantity: 1,
              currentVariation: defaultVariation,
              productData: res.data,
              toppingCheckeds: [],
              currentComboM: null,
              currentComboL: null
            };

            var totalPrice = Intl.NumberFormat().format(
              Math.round(
                window.popupData.quantity *
                  window.popupData.currentVariation.display_price
              )
            );

            // Load dữ liệu lên màn hình
            var imgUrl = data["image"]
              ? data["image"]
              : config.baseURL +
                "/wp-content/themes/tocotocotea/assets/images/product_default_img.webp";
            productImg.attr("src", imgUrl);
            productName.text(data["product_name"]);
            productShortDes.html(data["product_short_desc"]);
            productPrice.text(
              Intl.NumberFormat().format(
                Math.round(defaultVariation["display_price"])
              ) + "đ"
            );
            if (
              defaultVariation.display_regular_price >
              defaultVariation.display_price
            ) {
              productRegularPrice.text(
                Intl.NumberFormat().format(
                  defaultVariation["display_regular_price"]
                ) + "đ"
              );
            } else {
              productRegularPrice.text("");
            }

            $(".popup-choose-product .btn-price-product").text(
              "+ " + totalPrice + "đ"
            );
            $(".popup-choose-product .amount").text(window.popupData.quantity);

            // Bind variation type, size
            var sizes = [];
            var types = [];
            data.variations.forEach((item) => {
              if (!sizes.includes(item.attributes.attribute_size)) {
                sizes.push(item.attributes.attribute_size);
              }
              if (!types.includes(item.attributes.attribute_type)) {
                types.push(item.attributes.attribute_type);
              }
            });

            sizes.forEach((item, index) => {
              var checked = index === 0 ? "checked" : "";
              var html = $(`<label class="container-radio">
                              <span>Size ${item.toUpperCase()}</span>
                              <input type="radio" ${checked} value="${item}" name="size">
                              <span class="checkmark-radio"></span>
                            </label>`);
              $(".customize-section.size .customize-content").append(html);
            });

            types.forEach((item, index) => {
              var checked = index === 0 ? "checked" : "";
              var html = $(`<label class="container-radio">
                              <span>${me.getTypeName(item)}</span>
                              <input type="radio" ${checked} value="${item}" name="type">
                              <span class="checkmark-radio"></span>
                            </label>`);
              $(".customize-section.type .customize-content").append(html);
            });

            // bind sugar customize
            var sugars = data.customizations.filter((item) =>
              item.name.includes("sugar")
            );
            var ices = data.customizations.filter((item) =>
              item.name.includes("ice")
            );
            sugars.forEach((sugar, index) => {
              var checked = index === 0 ? "checked" : "";
              var sugarHTML = $(`<label class="container-radio">
                                  <span>${sugar.value}</span>
                                  <input type="radio" ${checked} name="sugar" value="${sugar.name}">
                                  <span class="checkmark-radio"></span>
                                </label>`);
              $(".customize-section.sugar .customize-content").append(
                sugarHTML
              );
            });

            // bind ice
            ices.forEach((ice, index) => {
              var checked = index === 0 ? "checked" : "";
              var iceHTML = $(`<label class="container-radio">
                                  <span>${ice.value}</span>
                                  <input type="radio" ${checked} name="ice" value="${ice.name}">
                                  <span class="checkmark-radio"></span>
                                </label>`);
              $(".customize-section.ice .customize-content").append(iceHTML);
            });

            // bind topping
            data.toppings.forEach((topping, index) => {
              var toppingHTML = $(`<div class="topping-wrap">
                                <label class="container-checkbox">
                                  <span>${topping.value}</span>
                                  <input type="checkbox" name="topping" value="${
                                    topping.name
                                  }">
                                  <span class="checkmark"></span>
                                </label>
                                <span class="topping-price">+ ${Intl.NumberFormat().format(
                                  topping.price
                                )}đ</span>
                              </div>`);
              $(".customize-section.topping .customize-content").append(
                toppingHTML
              );
            });

            // bind combom
            data.comboM.forEach((item,index) => {
              var checked = index === 0 ? "checked" : "";
              var html = $(`<label class="container-radio">
                              <span>${item.value}</span>
                              <input type="radio" ${checked} value="${item.name}" name="comboM">
                              <span class="checkmark-radio"></span>
                            </label>`);
              $(".customize-section.comboM .customize-content").append(html);
            });

            data.comboL.forEach((item,index) => {
              var checked = index === 0 ? "checked" : "";
              var html = $(`<label class="container-radio">
                              <span>${item.value}</span>
                              <input type="radio" ${checked} value="${item.name}" name="comboL">
                              <span class="checkmark-radio"></span>
                            </label>`);
              $(".customize-section.comboL .customize-content").append(html);
            });

            if(data.comboM.length > 0){
              $(".customize-section.sugar").hide();
              $(".customize-section.type").hide();
              $(".customize-section.size").hide();
              $(".customize-section.topping").hide();
              $(".customize-section.ice").hide();

              me.loadDefaultCombo();
            }else{
              $(".customize-section.comboM").hide();
              $(".customize-section.comboL").hide();
            }

            // Cập nhật lại customization đang select
            me.updateCustomizations();
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          //Làm gì đó khi có lỗi xảy ra
          console.log(
            "The following error occured: " + textStatus,
            errorThrown
          );
        },
      });
    },

    /**
     * Convert type name to VN
     * Created by: bhtrang
     * 25/12/2020
     */
    getTypeName(type) {
      var typeName = "";
      switch (type) {
        case "cold":
          typeName = "Lạnh";
          break;
        case "hot":
          typeName = "Nóng";
          break;
        default:
          break;
      }
      return typeName;
    },

    /**
     * Xử lý click thay đổi số lượng món
     * Created by: bhtrang
     * 25/12/2020
     */
    handleClickChangeQuantity(e) {
      var target = $(e.currentTarget);
      if (target.hasClass("increase")) {
        window.popupData.quantity++;
      } else {
        if (window.popupData.quantity > 1) {
          window.popupData.quantity--;
        }
      }
      if(window.popupData.productData.comboM == null || window.popupData.productData.comboM.length == 0){
        this.refreshPopup();
      }else{
        var comboValM = $("input[type=radio][name=comboM]:checked").val();
        var comboValL = $("input[type=radio][name=comboL]:checked").val();
        
        var comboM = window.popupData.productData.comboM ?? null;
        var comboL = window.popupData.productData.comboL ?? null;

        var matchComBoM = comboM.find(
          (item) => item.name == comboValM
        );

        var matchComBoL = comboL.find(
          (item) => item.name == comboValL
        );

        window.popupData.currentComboM = matchComBoM ?? null;
        window.popupData.currentComboL = matchComBoL ?? null;
        this.refreshPopupCombo();
      }
    },

    /**
     * Xử lý click thay đổi variation size M, L, Nóng, Lạnh
     * Created by: bhtrang
     * 25/12/2020
     */
    handleChangeVariation(e) {
      var type = $("input[type=radio][name=type]:checked").val();
      var size = $("input[type=radio][name=size]:checked").val();
      var variations = window.popupData.productData.variations;
      var matchVariation = variations.find(
        (item) =>
          item.attributes.attribute_size === size &&
          item.attributes.attribute_type === type
      );
      window.popupData.currentVariation = matchVariation;

      this.refreshPopup();
    },

    /**
     * Xử lý thay đổi combo size M, L
     * @param {*} e 
     */
    handleChangeCombo(e){
      var comboValM = $("input[type=radio][name=comboM]:checked").val();
      var comboValL = $("input[type=radio][name=comboL]:checked").val();
      
      var comboM = window.popupData.productData.comboM ?? null;
      var comboL = window.popupData.productData.comboL ?? null;

      var matchComBoM = comboM.find(
        (item) => item.name == comboValM
      );

      var matchComBoL = comboL.find(
        (item) => item.name == comboValL
      );

      window.popupData.currentComboM = matchComBoM ?? null;
      window.popupData.currentComboL = matchComBoL ?? null;

      this.refreshPopupCombo();
    },

    /**
     * Xử lý click thay đổi topping
     * Created by: bhtrang
     * 25/12/2020
     */
    handleChangeTopping(e) {
      var toppingCheckeds = [];
      $(".topping-wrap input[type=checkbox]:checked").each(function () {
        toppingCheckeds.push($(this).val());
      });
      var allTopping = window.popupData.productData.toppings;
      var listCheckedTopping = allTopping.filter((item) =>
        toppingCheckeds.includes(item.name)
      );
      window.popupData.toppingCheckeds = listCheckedTopping;

      this.refreshPopup();
    },

    /**
     * Xử lý thay đổi customization
     * Created by: bhtrang
     * 25/12/2020
     */
    updateCustomizations(e) {
      var listCustomization = window.popupData.productData.customizations;
      var sugarValue = $(
        ".customize-section.sugar input[type=radio]:checked"
      ).val();
      var iceValue = $(
        ".customize-section.ice input[type=radio]:checked"
      ).val();
      var customizations = listCustomization.filter(
        (item) => item.name === sugarValue || item.name === iceValue
      );
      window.popupData.customizations = customizations;
    },

    /**
     * Xử lý click chọn sản phẩm
     * Created by: bhtrang
     * 25/12/2020
     */
    handleClickBtnPrice(e) {
      var target = $(e.currentTarget);
      var cartItem = window.popupData.currentVariation;
      var date = new Date();
      cartItem.comboM = window.popupData.currentComboM ?? null;
      cartItem.comboL = window.popupData.currentComboL ?? null;

      cartItem.toppings = window.popupData.toppingCheckeds;
      cartItem.customizations = window.popupData.customizations;
      cartItem.quantity = window.popupData.quantity;
      cartItem.productName = window.popupData.productData.product_name;
      cartItem.id = date.getTime();
      cartItem.image = window.popupData.productData.image;

      // Dữ liệu sản phẩm gửi lên google analytics
      var productGA = {
        id: cartItem.sku,
        name: cartItem.productName,
        list_name: "",
        brand: "Tocotoco",
        category: "",
        variant:
          cartItem.attributes.attribute_size +
          "/" +
          cartItem.attributes.attribute_type,
        list_position: 1,
        quantity: cartItem.quantity,
        price: cartItem.display_price,
      };
      googleAnalytics.add_to_cart([productGA]);

      switch (cartItem.attributes.attribute_size) {
        case "m":
          cartItem.productName = cartItem.productName + " (M)";
          break;
        case "l":
          cartItem.productName = cartItem.productName + " (L)";
          break;
        default:
          break;
      }
      // Nếu chưa có cartData thì tạo ra trong sessionStorage
      if (!sessionStorage.getItem("cartData")) {
        var cartData = [];
        sessionStorage.setItem("cartData", JSON.stringify(cartData));
      }

      var cartData = JSON.parse(sessionStorage.getItem("cartData"));
      cartData.push(cartItem);
      sessionStorage.setItem("cartData", JSON.stringify(cartData));

      target.parents(".wrap-popup").remove();
      jQuery("html").removeClass("disable-scroll");
      // refresh cart
      this.refreshCart();
    },

    /**
     * Xử lý thay đổi quantity trên cart
     * Created by: bhtrang
     * 25/12/2020
     */
    handleChangeQuantityOnCart(e) {
      var target = $(e.currentTarget);
      var cartItemID = parseInt(target.parents(".cart-ss1-item").attr("id"));
      var cartData = JSON.parse(sessionStorage.getItem("cartData"));
      var cartItem = cartData.find((item) => item.id === cartItemID);

      // Nếu tăng
      if (target.hasClass("increase")) {
        cartItem.quantity++;
      }
      // Nếu giảm
      else {
        if (cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          var indexRemove = cartData.indexOf(cartItem);
          cartData.splice(indexRemove, 1);
        }
      }

      sessionStorage.setItem("cartData", JSON.stringify(cartData));

      this.refreshCart();
    },

    /**
     * Xử lý clear cart
     * Created by: bhtrang
     * 25/12/2020
     */
    handleClearCart(e) {
      sessionStorage.removeItem("cartData");
      this.refreshCart();
    },

    /**
     * Xử lý nút thanh toán
     * Created by: bhtrang
     * 25/12/2020
     */
    executeClickBtnCart(e) {
      e.stopPropagation();
      if (sessionStorage.getItem("cartData")) {
        // Thêm dữ liệu sản phẩm lên google analytic
        var cartData = JSON.parse(sessionStorage.getItem("cartData"));
        var productGAs = cartData.map((item) => {
          return {
            id: item.sku,
            name: item.productName,
            list_name: "",
            brand: "Tocotoco",
            category: "",
            variant:
              item.attributes.attribute_size +
              "/" +
              item.attributes.attribute_type,
            list_position: 1,
            quantity: item.quantity,
            price: item.display_price,
          };
        });
        googleAnalytics.begin_checkout(productGAs);

        window.scrollTo(0, 0);
        common.showLoadingMobile("body");
        window.location.assign(config.baseURL + "/checkout");
        //window.location.assign(config.baseURL + "/?page_id=18");
      }
    },

    /**
     * Làm mới lại nội dung popup
     * Created by: bhtrang
     * 07/12/2020
     */
    refreshPopup() {
      var currentVariation = window.popupData.currentVariation;
      var regularPrice =
        currentVariation.display_price < currentVariation.display_regular_price
          ? Intl.NumberFormat().format(currentVariation.display_regular_price)
          : "";
      var toppingPrice = 0;
      if (window.popupData.toppingCheckeds) {
        window.popupData.toppingCheckeds.forEach((item) => {
          toppingPrice = toppingPrice + parseInt(item.price);
        });
      }
      var totalPrice = Intl.NumberFormat().format(
        window.popupData.quantity *
          (window.popupData.currentVariation.display_price + toppingPrice)
      );
      $("#pp-product-price").text(
        Intl.NumberFormat().format(currentVariation.display_price)
      );
      $("#pp-product-regular-price").text(regularPrice);
      $(".btn-price-product").text("+ " + totalPrice + "đ");
      $(".amount").text(window.popupData.quantity);
    },

    /**
     * Làm mới lại nội dung popup cho combo
     */
    refreshPopupCombo(){
      var currentComboM = window.popupData.currentComboM;
      var currentComboL = window.popupData.currentComboL;

      var regularPrice = Intl.NumberFormat().format(
        parseInt(currentComboM.regular_price) + parseInt(currentComboL.regular_price)
      );

      var salePrice = Intl.NumberFormat().format(
        parseInt(currentComboM.sale_price) + parseInt(currentComboL.sale_price)
      );
      var totalPrice = Intl.NumberFormat().format(
        window.popupData.quantity *
          (parseInt(currentComboM.sale_price) + parseInt(currentComboL.sale_price))
      );

      $("#pp-product-price").text(
        salePrice + "đ"
      );
      $("#pp-product-regular-price").text(regularPrice + "đ");
      $(".btn-price-product").text("+ " + totalPrice + "đ");
      $(".amount").text(window.popupData.quantity);
    },

    /**
     * Load default combo M1 L1
     */
    loadDefaultCombo(){
      var comboValM = $("input[type=radio][name=comboM]:checked").val();
      var comboValL = $("input[type=radio][name=comboL]:checked").val();
      
      var comboM = window.popupData.productData.comboM ?? null;
      var comboL = window.popupData.productData.comboL ?? null;

      var matchComBoM = comboM.find(
        (item) => item.name == comboValM
      );

      var matchComBoL = comboL.find(
        (item) => item.name == comboValL
      );

      window.popupData.currentComboM = matchComBoM ?? null;
      window.popupData.currentComboL = matchComBoL ?? null;
    },

    /**
     * Refresh dữ liệu giỏ hàng
     * Created by: bhtrang
     * 08/12/2020
     */
    refreshCart() {
      var cartData = JSON.parse(sessionStorage.getItem("cartData"));
      var cartSS1 = $(".cart-ss1");
      cartSS1.html("");
      var grandTotal = 0;
      var grandAmount = 0;
      if (cartData) {
        cartData.forEach((item) => {
          var cartItem = $(`<div class="cart-ss1-item">
                              <div class="cart-ss1-left">
                                <div class="name">Trà sữa loading...</div>
                                <div class="customize">Size M, 100% đá, 100% đường</div>
                                <div class="total">....đ</div>
                              </div>
                              <div class="cart-ss1-right">
                                <div class="change-quantity decrease">-</div>
                                <div class="amount">1</div>
                                <div class="change-quantity increase">+</div>
                              </div>
                            </div>`);
          var priceTopping = 0;
          item.toppings.forEach((topping) => {
            priceTopping = priceTopping + parseInt(topping.price);
          });
          
          var productPrice = 0;
          var total = 0;

          //Kiểm tra điều kiện xem đó có phải combo hay không?
          if(item.comboM == null){
            productPrice = priceTopping + item.display_price;
            total = productPrice * item.quantity;
          }else{
            productPrice = parseInt(item.comboM.sale_price) + parseInt(item.comboL.sale_price);
            total = productPrice * item.quantity;
          }
          
          grandTotal = grandTotal + total;
          grandAmount = grandAmount + item.quantity;

          var customizationText = "";
          //Kiểm tra điều kiện xem đó có phải combo hay không?
          if(item.comboM == null){
            item.toppings.forEach((topping) => {
              customizationText = customizationText + topping.value + ",";
            });
            item.customizations.forEach((customization) => {
              customizationText = customizationText + customization.value + ",";
            });
          }else{
            customizationText = item.comboM.value + "," + item.comboL.value;
          }
          

          cartItem.attr("id", item.id);
          cartItem.find(".name").text(item.productName);
          cartItem.find(".customize").text(customizationText);
          cartItem
            .find(".total")
            .text(
              `${Intl.NumberFormat().format(productPrice)}đ x ${
                item.quantity
              } = ${Intl.NumberFormat().format(total)}đ`
            );
          cartItem.find(".amount").text(item.quantity);
          cartSS1.append(cartItem);
          $(".popup-choose-product-wrap").remove();
        });
      } else {
        cartSS1.append("Chưa có sản phẩm nào!");
      }

      $(".cart-ss2-two").text(grandAmount);
      $(".cart-ss2-four").text(Intl.NumberFormat().format(grandTotal) + "đ");
    },

    /**
     * Mở popup thông báo chưa đến giờ hoạt động
     * by:Phat
     */
    handleClickNotiCloseCart(e) {
      var popupContent = $("input[name=popupContent]").val();
      var html = $(
        `<div class="working-time-popup"><div class="working-time-title">${popupContent}</div></div>`
      );
      common.openPopup(html, {
        title: "Thông báo chưa đến giờ hoạt động",
        width: 600,
        height: 400,
      });
    },
    /**
     * Xử lý click trên menu item
     * Created by: bhtrang
     * 25/12/2020
     */
    handleClickMenuItem(e) {
      var slug = $(e.currentTarget).attr("catslug");
      var categoryContainer = $(`.order-center .category[catslug="${slug}"]`);
      $("html,body").animate(
        {
          scrollTop: categoryContainer[0].offsetTop,
        },
        "slow"
      );
    },
    /**
     * Xử lý đóng mở group item
     * Created by: bhtrang
     * 25/12/2020
     */
    handleCollapseGroupItem(e) {
      var listProduct = $(e.currentTarget).next();
      listProduct.slideToggle();
    },
    /**
     * Xử lý tìm kiếm sản phẩm
     * Created by: bhtrang
     * 29/12/2020
     */
    handleSearchProduct(e) {
      // Nếu nhấm enter
      if (e.keyCode === 13) {
        var searchText = $(e.currentTarget).val();
        if (searchText.length > 0) {
          window.location.assign(
            `${config.baseURL}/order?search_text=${searchText}`
          );
        } else {
          window.location.assign(`${config.baseURL}/order`);
        }
      }
    },
    /**
     * Xử lý thu nhỏ giỏ hàng
     * Created by: bhtrang
     * 01/01/2021
     */
    handleClickCollapseCart(e) {
      $(".cart-group-top").slideToggle(500);
    },
    /**
     * Xử lý click mở rộng giỏ hàng
     * Created by: bhtrang
     * 01/01/2021
     */
    handleClickExtendCart(e) {
      $(".cart-group-top").slideToggle(500);
    },
    /**
     * Xủ lý Slide menu mobile
     * Created by: bhtrang
     * 01/01/2021
     */
    handleClickBtnMenuMobile(e) {
      var target = $(e.currentTarget);
      if (target.hasClass("open")) {
        target.removeClass("open");
      } else {
        target.addClass("open");
      }
      $(".sidebar-left").toggle(300);
    },
    /**
     * Hàm mở popup add product nếu chọn sản phẩm từ trang home
     * Created by: bhtrang
     * 17/03/2021
     */
    openPopupAddProduct() {
      const urlParams = new URLSearchParams(window.location.search);
      const productID = urlParams.get("product_id");
      if (productID) {
        window.onload = (event) => {
          jQuery(`.product[product_id="${productID}"]`).first().click();
        };
      }
    },
    /**
     * Hàm mở popup thông báo thời gian làm việc
     * Created by: mink
     * 15/02/2022
     */
    openPopupWorkingTime() {
      var startTime = $("input[name=startTime]").val();
      var endTime = $("input[name=endTime]").val();
      var popupContent = $("input[name=popupContent]").val();
      if (startTime && endTime) {
        var format = "HH:mm";
        var currentTime = moment().format(format);
        var time = moment(currentTime, format),
          beforeTime = moment(startTime, format),
          afterTime = moment(endTime, format);

        // Mở Popup khi đang ngooài thời gian làm việc
        if (!time.isBetween(beforeTime, afterTime)) {
          var html = $(
            `<div class="working-time-popup"><div class="working-time-title">${popupContent}</div></div>`
          );
          common.openPopup(html, {
            title: "Thông báo",
            width: 400,
            height: 200,
          });
        }
      }
    },
    /**
     * back
     * Created by: bhtrang
     * 22/03/2021
     */
    back(e) {
      window.scrollTo(0, 0);
      common.showLoadingMobile("body");
      window.location.assign(config.baseURL + "/news-mobile");
    },
  };

  // Gọi hàm khởi tạo trang order
  order.init();

  /**
   * Event click nút tăng trên sản phẩm
   * Created by: bhtrang
   * 04/12/2020
   */
  $(".main-center").on("click", ".product", (e) =>
    order.handleClickAddProduct(e)
  );

  /**
   * Sự kiện click change quantity trong popup
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on("click", ".popup-choose-product .change-quantity", (e) =>
    order.handleClickChangeQuantity(e)
  );

  /**
   * Xử lý thay đổi loại sản phẩm
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on(
    "click",
    "input[type=radio][name=type], input[type=radio][name=size]",
    (e) => order.handleChangeVariation(e)
  );

  /**
   * Xử lý thay đổi món trong combo M
   * 
   */
  $("body").on(
    "click",
    "input[type=radio][name=type], input[type=radio][name=comboM]",
    (e) => order.handleChangeCombo(e)
  ); 

   /**
   * Xử lý thay đổi món trong combo L
   * 
   */
   $("body").on(
    "click",
    "input[type=radio][name=type], input[type=radio][name=comboL]",
    (e) => order.handleChangeCombo(e)
  );

  /**
   * Xử lý thay đổi topping
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on("click", ".topping-wrap input[type=checkbox]", (e) =>
    order.handleChangeTopping(e)
  );

  /**
   * Xử lý thay đổi đường đá.
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on(
    "click",
    ".customize-section.sugar input[type=radio], .customize-section.ice input[type=radio]",
    (e) => order.updateCustomizations(e)
  );

  /**
   * Xử lý nhấn nút thêm sản phẩm trong popup.
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on("click", ".btn-price-product", (e) =>
    order.handleClickBtnPrice(e)
  );

  /**
   * Xử lý thay đổi quantity ở giỏ hàng
   * Created by: bhtrang
   * 07/12/2020
   */
  $("body").on("click", ".cart-ss1 .change-quantity", (e) =>
    order.handleChangeQuantityOnCart(e)
  );

  /**
   * Xử lý clear cart
   * Created by: bhtrang
   * 08/12/2020
   */
  $("body").on("click", "#clear-cart", (e) => order.handleClearCart(e));

  /**
   * Xử lý click nút thanh toán ở giỏ hàng
   * Created by: bhtrang
   * update Edit: Phat
   * 08/12/2020
   */
   $("body").on("click", ".cart-ss3 .button-cart", (e) => {
    var startTime = $("input[name=startTime]").val() + ":00";
    var endTime = $("input[name=endTime]").val() + ":00";
    var date = new Date();
    var time = date.toLocaleTimeString('en-US', { hour12: false });
    if (time > startTime && time < endTime){
      order.executeClickBtnCart(e);
    }
    else{
      order.handleClickNotiCloseCart(e);
    }

    //order.executeClickBtnCart(e);
  }
  );
  /**
   * Xử lý click menu item
   * Created by: bhtrang
   * 08/12/2020
   */
  $("body").on("click", ".order-content .cat-item", (e) =>
    order.handleClickMenuItem(e)
  );
  /**
   * Xử lý đóng mở group item
   * Created by: bhtrang
   * 08/12/2020
   */
  $("body").on("click", ".order-content .category-name", (e) =>
    order.handleCollapseGroupItem(e)
  );
  /**
   * Xử lý tìm kiếm sản phẩm
   * Created by: bhtrang
   * 29/12/2020
   */
  $("body").on("keyup", ".order-header .input-search", (e) =>
    order.handleSearchProduct(e)
  );
  /**
   * Xử lý thu nhỏ giỏ hàng - mobile
   * Created by: bhtrang
   * 29/12/2020
   */
  $("body").on("click", ".sidebar-right .arrow-down", (e) =>
    order.handleClickCollapseCart(e)
  );
  /**
   * Xử lý mở rộng giỏ hàng - mobile
   * Created by: bhtrang
   * 29/12/2020
   */
  $("body").on("click", ".sidebar-right .cart-group-bottom", (e) =>
    order.handleClickExtendCart(e)
  );
  /**
   * Xử lý slide memu mobile - mobile
   * Created by: bhtrang
   * 29/12/2020
   */
  $("body").on("click", ".order-content .btn-menu", (e) =>
    order.handleClickBtnMenuMobile(e)
  );
  /**
   * Back
   * Created by: bhtrang
   * 22/03/2021
   */
  $("body").on("click", ".order-header .btn-back i", (e) => order.back(e));
});
