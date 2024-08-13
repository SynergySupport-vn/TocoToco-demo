var common = {
  init() {
    this.checkLoginByZaloID();
    this.initEvent();
    this.initSourceID();
    this.navigateToMobileVersion();
  },

  /**
   * Kiểm tra liệu người dùng có login bằng ZaloID
   * Created by: bhtrang
   * 18/06/2021
   */
  checkLoginByZaloID() {
    const urlParams = new URLSearchParams(window.location.search);
    var source_id = urlParams.get("source_id");
    var zalo_id = urlParams.get("zalo_id");
    if (zalo_id && source_id === "zalo") {
      // check login by zaloID
      jQuery.ajax({
        type: "post",
        dataType: "json",
        url: AJAX.url,
        data: {
          action: "loginByZaloID",
          zalo_id: zalo_id,
        },
        success: function (res) {
          if (res.data) {
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            window.location.assign(config.baseURL + "/");
          }
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(
            "The following error occured: " + textStatus,
            errorThrown
          );
        },
      });
    }
  },

  /**
   * Chuyển hướng tới phiên bản mobile
   * Created by: bhtrang
   * 29/03/2021
   */
  navigateToMobileVersion(e) {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      if (
        !sessionStorage.getItem("isMobile") &&
        window.location.pathname === "/"
      ) {
        const urlParams = new URLSearchParams(window.location.search);
        var source_id = urlParams.get("source_id");
        sessionStorage.setItem("isMobile", "true");
        if (source_id === "web") {
          window.location.assign(`${config.baseURL}/news-mobile?source_id=app`);
        } else {
          window.location.assign(
            `${config.baseURL}/news-mobile?source_id=${source_id}`
          );
        }
      }
    }
  },

  initEvent() {
    // Click btn close
    jQuery(document).on("click", ".wrap-popup .close-btn", (e) =>
      this.handleClosePopup(e)
    );
    // Click nav item
    jQuery(document).on("click", "header .menu-item a", (e) =>
      this.handleClickNavItem(e)
    );
    // Sự kiện window scroll
    jQuery(window).on("scroll", this.handleWindowScroll.bind(this));
    // Sự kiện click button giao hàng
    jQuery(document).on(
      "click",
      ".btn-delivery",
      this.handleClickBtnDelivery.bind(this)
    );
    if (window.innerWidth <= 768) {
      jQuery(document).on(
        "click",
        ".menu-primary li.menu-item-has-children",
        this.handleClickMenuItemHasChild.bind(this)
      );
    }
    // Sự kiện click vào nút mở rộng menu màn hình mobile
    jQuery(document).on(
      "click",
      ".btn-menu-mobile",
      this.handleClickExpandMenuMobile.bind(this)
    );
    // Sự kiện click đóng menu mobile
    jQuery(document).on(
      "click",
      "#header .btn-close",
      this.closeMenuMobile.bind(this)
    );
  },

  /**
   * Đóng menu mobile
   * Created by: bhtrang
   * 07/04/2021
   */
  closeMenuMobile(e) {
    var menu = jQuery("#header .menu");
    menu.removeClass("menu-mobile");
    menu.hide();
  },

  /**
   * Xử lý mở rộng menu mobile
   * Created by: bhtrang
   * 07/04/2021
   */
  handleClickExpandMenuMobile() {
    var menu = jQuery("#header .menu");
    menu.addClass("menu-mobile");
    menu.show();
  },

  /**
   * Xử lý click trên menu-item có con
   * Created by: bhtrang
   * 29/03/2021
   */
  handleClickMenuItemHasChild(e) {
    return;
  },

  /**
   * Xử lý sự kiện window scroll
   * Created by: bhtrang
   * 18/03/2021
   */
  handleWindowScroll(e) {
    if (window.scrollY > 150) {
      jQuery("#header-wrap").addClass("scroll-header");
    } else {
      jQuery("#header-wrap").removeClass("scroll-header");
    }
  },

  /**
   * Xử lý đóng popup
   * Created by: bhtrang
   * 29/12/2020
   */
  handleClosePopup(e) {
    var target = jQuery(e.currentTarget);
    target.parents(".wrap-popup").remove();
    jQuery("html").removeClass("disable-scroll");
  },

  /**
   * Sự kiện mở một popup
   * Created by: bhtrang
   * 04/03/2021
   */
  openPopup(popupHTML, config, callback) {
    callback = callback ? callback : () => {};
    var popupWrap = jQuery(`<div class="wrap-popup" scroll="no">
                              <div class="popup ${
                                config.class ? config.class : ""
                              }">
                                <div class="popup-title">${config.title}</div>
                                <div class="close-btn">  <i class="fas fa-times"></i></div>
                                <div class="popup-content">
                                </div>
                              </div>
                              <div class="overlay"></div>
                            </div>`);
    popupWrap.find(".popup-content").append(popupHTML);
    var popupCss = {
      width: config.width + "px",
      height: config.height + "px",
      top: `calc(50% - ${config.height / 2}px)`,
      left: `calc(50% - ${config.width / 2}px)`,
    };

    popupWrap.find(".popup").css(popupCss);
    popupWrap.find(".popup-content").html(popupHTML);
    jQuery("body").append(popupWrap);
    callback();
    jQuery("html").addClass("disable-scroll");
  },

  /**
   * Mở hộp thoại xác nhận
   * Created by: bhtrang
   * 17/05/2021
   */
  openConfirmDialog(description, callback) {
    var me = this;

    var date = new Date();
    var ran = Math.floor(Math.random() * 1001);
    var popupID = date.getTime() + ran;

    var popupHTML = jQuery(`<div>
                              <div class="dialog-description">${description}</div>
                              <div class="group-btn">
                                <button type="button" id="btn-confirm-${popupID}" class="btn btn-dialog-confirm btn-success">Đồng ý</button>
                                <button type="button" id="btn-cancel-${popupID}" class="btn btn-dialog-cancel btn-danger">Đóng</button>
                              </div>
                            </div>`);
    jQuery(document).on("click", `#btn-cancel-${popupID}`, (e) => {
      me.handleClosePopup(e);
    });
    jQuery(document).on("click", `#btn-confirm-${popupID}`, (e) => {
      me.handleClosePopup(e);
      if (callback) {
        callback();
      }
    });
    var popupConfig = {
      title: "Xác nhận",
      class: "confirm-dialog",
      width: "500",
      height: "250",
    };

    this.openPopup(popupHTML, popupConfig);
  },

  /**
   * Load vị trí lên map
   * Created by: bhtrang
   * 14/12/2020
   */
  loadMap(lat, long, containner) {
    goongjs.accessToken = config.goongMapKey;
    var map = new goongjs.Map({
      container: containner,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [long, lat], // starting position [lng, lat]
      zoom: 15, // starting zoom
    });

    map.on("load", function () {
      map.loadImage(
        config.baseURL +
          "/wp-content/themes/tocotocotea/assets/images/map-marker-alt-solid.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("cat", image);
          map.addLayer({
            id: "points",
            type: "symbol",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    geometry: {
                      type: "Point",
                      coordinates: [long, lat],
                    },
                  },
                ],
              },
            },
            layout: {
              "icon-image": "cat",
              "icon-size": 0.08,
            },
          });
        }
      );
    });
  },

  /**
   * Hiện loading
   * Created by: bhtrang
   * 22/12/2020
   */
  showLoading(selector, opacity = 0.6) {
    var element = jQuery(selector);
    var html = jQuery(`<div class="loader-wrapper">
                        <div class="loader"></div>
                      </div>`);
    if (element.css("position") === "static") {
      element.css({position: "relative"});
    }
    html.css("background", `rgba(128, 128, 128, ${opacity})`);
    if (selector === "body") {
      html
        .find(".loader")
        .css({top: "50vh", left: "50vw", position: "absolute"});
    }
    element.append(html);
  },

  /**
   * Xóa loading
   * Created by: bhtrang
   * 30/12/2020
   */
  removeLoading(selector) {
    var element = jQuery(selector);
    element.find(".loader-wrapper").remove();
  },

  /**
   * Open new tab nếu click vào trang sản phẩm
   * Created by: bhtrang
   * 16/03/2021
   */
  handleClickNavItem(e) {
    if (jQuery(e.target).text().toLowerCase() === "sản phẩm") {
      e.preventDefault();
      var source_id = sessionStorage.getItem("source_id") || "web";
      window.open(`${config.baseURL}/order?source_id=${source_id}`);
    }
  },

  /**
   * Khởi tạo giá trị nguồn đơn
   * Created by: bhtrang
   * 16/03/2021
   */
  initSourceID() {
    const urlParams = new URLSearchParams(window.location.search);
    var source_id = urlParams.get("source_id");
    var token = urlParams.get("token");
    if (source_id) {
      sessionStorage.setItem("source_id", source_id);
    } else {
      if (!sessionStorage.getItem("source_id")) {
        sessionStorage.setItem("source_id", "web");
      }
    }

    // Hiện nút back nếu nguồn là app
    jQuery(document).ready(function () {
      if (sessionStorage.getItem("source_id") === "app") {
        jQuery(".order-header .btn-back").css("display", "inline-block");
      }
    });

    // Trường hợp nguồn call center
    this.handleWhenCallCenter(source_id, token);
  },
  /**
   * Xử lý khi nguồn đơn là callcenter
   * Created by: bhtrang
   * 25/03/2021
   */
  handleWhenCallCenter(source_id, token) {
    if (
      sessionStorage.getItem("source_id") === "callcenter" &&
      sessionStorage.getItem("callcenter-token") === config.callcenterToken
    ) {
      jQuery(document).ready(function () {
        jQuery(".order-header .logo").after(
          `<div class='callcenter-text'>Call Center</div>`
        );
        jQuery(".order-header .right").css("visibility", "hidden");
      });
    } else {
      if (source_id === "callcenter") {
        if (token === config.callcenterToken) {
          jQuery(document).ready(function () {
            jQuery(".order-header .logo").after(
              `<div class='callcenter-text'>Call Center</div>`
            );
            jQuery(".order-header .right").css("visibility", "hidden");
            sessionStorage.setItem("callcenter-token", token);
          });
        } else {
          sessionStorage.setItem("source_id", "web");
          window.location.assign(`${config.baseURL}/`);
        }
      }
    }
  },
  /**
   * Hiện loading mobile
   * Created by: bhtrang
   * 19/03/2021
   */
  showLoadingMobile(selector, opacity = 0.6) {
    var element = jQuery(selector);
    var html = jQuery(`<div class="loader-wrapper-mobile">
                        <div class="loader-mobile"></div>
                      </div>`);
    if (element.css("position") === "static") {
      element.css({position: "relative"});
    }
    html.css("background", `black`);
    if (selector === "body") {
      html.find(".loader-mobile").css({
        top: "calc(50vh - 200px)",
        left: "calc(50vw - 200px)",
        position: "absolute",
      });
    }
    element.append(html);
  },

  /**
   * Xóa loading
   * Created by: bhtrang
   * 30/12/2020
   */
  removeLoadingMobile(selector) {
    var element = jQuery(selector);
    element.find(".loader-wrapper-mobile").remove();
    $("html, body").css("overflow", "scroll");
  },

  /**
   * Xử lý khi click button giao hàng
   * Created by: bhtrang
   * 24/03/2021
   */
  handleClickBtnDelivery(e) {
    window.scrollTo(0, 0);
    common.showLoadingMobile("body");
  },

  /**
   * Copy vào clipboard
   * Created by: bhtrang
   * 08/04/2021
   */
  copyToClipboard(text) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  },

  /**
   * Lưu data vào Local Storage với lifetime
   * Created by: mink
   * 03/01/2022
   */
  saveDataWithExpiry(key, value, ttl) {
    const now = new Date();
    // `item` is an object which contains the original value
    // as well as the time when it's supposed to expire
    const item = {
      value: value,
      expiry: now.getTime() + ttl * 1000,
    };
    console.log("saving Data: ", item);
    localStorage.setItem(key, JSON.stringify(item));
  },

  /**
   * Get Data Local Storage with Expiry
   * Created by: mink
   * 03/01/2022
   */
  getDataWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    // if the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    // compare the expiry time of the item with the current time
    if (now.getTime() > item.expiry) {
      // If the item is expired, delete the item from storage
      // and return null
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  },
};

common.init();
