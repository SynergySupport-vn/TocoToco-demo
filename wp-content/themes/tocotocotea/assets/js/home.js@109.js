var home = {
    /**
    * Hàm init
    * Created by: bhtrang
    * 11/03/2021
    */
    init() {
        this.initEvents();
        this.initialCarousel();
    },
    /**
    * Khởi tạo home slider
    * Created by: mink
    * 30/12/2021
    */
    initialCarousel() {
        jQuery(document).ready(function () {
            jQuery('.owl-carousel').owlCarousel({
                items: 1,
                dots: false,
                loop: true,
                nav: true,
                navText: ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"],
            });
        });
    },
    /**
    * Khởi tạo các sự kiện trong trang
    * Created by: bhtrang
    * 11/03/2021
    */
    initEvents() {
        // Sự kiện click play video
        jQuery(document).on('click', '.home .home-btn-play', this.openPopupVideo.bind(this));
        // Sự kiện click vào product trang home
        jQuery(document).on('click', '.home .product-card', this.handleClickProductCard.bind(this));
        // Sự kiện click vào nút đặt hàng và nút xem tất cả sản phẩm
        jQuery(document).on('click', '.home .order-now, .home .btn-view-all', this.navigateToOrderPage.bind(this));
        // Sự kiện click đóng Popup
        jQuery(document).on('click', '.home-popup .close-btn', this.handleClosePopupBanner.bind(this));
        // Sự kiện click nhượng quyền
        jQuery(document).on('click', '.btn-fcpage', this.navigateToFCPage.bind(this));
    },
    /**
    * Mở popup xem video
    * Created by: bhtrang
    * 11/03/2021
    */
    openPopupVideo(e) {
        var target = jQuery(e.currentTarget);
        var link = target.attr('link');
        var html = jQuery(`<iframe width="644" height="362" src="${link}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
        common.openPopup(html, { width: 650, class: 'video-popup', height: 400, title: '' })
    },
    /**
     * Xử lý click vào sản phẩm điều hướng tới trang order
     * Created by: bhtrang
     * 17/03/2021
    */
    handleClickProductCard(e) {
        var productID = jQuery(e.currentTarget).attr('product-id');
        var source_id = sessionStorage.getItem('source_id') || 'web';
        window.open(`${config.baseURL}/order?product_id=${productID}&source_id=${source_id}`);
    },
     /**
    * Close popup Banner
    * Created by: mink
    * 31/12/2021
    */
    handleClosePopupBanner(e) {
        e.preventDefault();
        // Ẩn Popup trong 1 tiếng nếu người dùng ấn tắt
        common.saveDataWithExpiry('hidePopup', true, 3600);
        jQuery('.home-popup').remove();
    },
    /**
     * Điều hướng đến trang đặt hàng
     * Created by: bhtrang
     * 23/03/2021
    */
    navigateToOrderPage(e) {
        var source_id = sessionStorage.getItem('source_id') || 'web';
        window.open(`${config.baseURL}/order?source_id=${source_id}`);
    },

    /**
     * Điều hướng đến trang nhượng quyền
     * Created by: haule.it
     * 24/02/2022
     */
    navigateToFCPage(e){
        var source_id = sessionStorage.getItem('source_id') || 'web';
        window.open(`${config.baseURL}/nhuongquyen?source_id=${source_id}`);
    }

}

// Gọi hàm khởi tạo trang home
home.init();
