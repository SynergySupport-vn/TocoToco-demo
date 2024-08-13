var headerOrder = {
  init() {
    this.initEvents();
    jQuery(document).ready((e) => {
      this.initHeaderLogin();
    });
  },
  /**
   * Xủ lý xự kiện trên header trang đặt hàng
   * Created by: bhtrang
   * 05/04/2021
   */
  initEvents() {
    // Click nút đăng nhập ở header
    jQuery(document).on(
      "click",
      ".order-header .login-button, .news-mobile .login-btn",
      this.handleClickBtnLogin
    );
    // Click thông tin người dùng trên header
    jQuery(document).on(
      "click",
      ".order-header .user-info",
      this.handleClickUserInfo
    );
  },

  /**
   * Xử lý click nút Đăng nhập trên header
   * Created by: bhtrang
   * 05/04/2021
   */
  handleClickBtnLogin(e) {
    window.location.assign(config.baseURL + "/account-login");
  },

  /**
   * Xử lý nhấn vào xem chi tiết thông tin
   * Created by: bhtrang
   * 05/04/2021
   */
  handleClickUserInfo(e) {
    window.location.assign(config.baseURL + "/account-layout");
  },

  /**
   * Khởi tạo phần đăng nhập ở header
   * Created by: bhtrang
   * 22/12/2020
   */
  initHeaderLogin() {
    var token = localStorage.getItem("token");
    if (token) {
      jQuery.ajax({
        type: "post",
        dataType: "json",
        url: AJAX.url,
        data: {
          action: "getUserInfo",
          token: token,
        },
        beforeSend: function () {},
        success: function (res) {
          if (res.success) {
            var user = res.data;
            var fullname = user.fullname ? user.fullname : "";
            var user_photo = user.user_photo
              ? user.user_photo
              : config.imagesFolder + "/logo_icon.png";
            var html = jQuery(`<div class="user-info">
                          <img class="user-img" src="${user_photo}" />
                          <div class="user-fullname">${fullname}</div>
                        </div>`);
            jQuery(".order-header .right").html(html);
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
    } else {
      var mcname = jQuery("#MCName").val();
      if (mcname === "" || mcname === undefined) {
        mcname = localStorage.getItem("mcname");
        if (mcname === "" || mcname === "null" || mcname === null) {
          var html = jQuery(`<div class="login-button">Đăng nhập</div>`);
          jQuery(".order-header .right").html(html);
        } else {
          localStorage.setItem("mcname", mcname);
          var html = jQuery(`<div class="user-info1">
                          <img class="user-img" src="https://ui-avatars.com/api/?name=${mcname}&background=random&rounded=true" />
                          <div class="user-fullname">${mcname}</div>
                        </div>`);
          jQuery(".order-header .right").html(html);
        }
      } else {
        localStorage.setItem("mcname", mcname);
        var html = jQuery(`<div class="user-info1">
                        <img class="user-img" src="https://ui-avatars.com/api/?name=${mcname}&background=random&rounded=true" />
                        <div class="user-fullname">${mcname}</div>
                      </div>`);
        jQuery(".order-header .right").html(html);
      }
    }
  },
};

headerOrder.init();
