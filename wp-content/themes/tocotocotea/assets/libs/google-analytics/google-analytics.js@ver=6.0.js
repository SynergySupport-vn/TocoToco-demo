var googleAnalytics = {
  /**
   * Measure product impressions
   * Created by: bhtrang
   * 16/04/2021
  */
  view_item_list(products) {
    gtag('event', 'view_item_list', {
      "items": products
    });
  },

  /**
   * Measure product detail views
   * Created by: bhtrang
   * 16/04/2021
  */
  view_item(product) {
    gtag('event', 'view_item', {
      "content_type": "product",
      "items": product
    });
  },
  /**
   * Measure additions to shopping carts
   * Created by: bhtrang
   * 16/04/2021
  */
  add_to_cart(product) {
    gtag('event', 'add_to_cart', {
      "items": product
    });
  },
  /**
   * Measure removals from shopping carts
   * Created by: bhtrang
   * 16/04/2021
  */
  remove_from_cart(product) {
    gtag('event', 'remove_from_cart', {
      "items": product
    });
  },

  /**
   * Measure promotion impressions
   * Created by: bhtrang
   * 16/04/2021
  */
  view_promotion(promotions) {
    gtag('event', 'view_promotion', {
      "promotions": promotions
    });
  },

  /**
   * Measure promotion clicks
   * Created by: bhtrang
   * 16/04/2021
  */
  select_promotion(promotion) {
    gtag('event', 'select_content', {
      "promotions": promotion
    });
  },

  /**
   * Measure first checkout step
   * Created by: bhtrang
   * 16/04/2021
  */
  begin_checkout(products) {
    gtag('event', 'begin_checkout', {
      "items": products,
      "coupon": ""
    });
  },

  /**
   * Measure purchases
   * Created by: bhtrang
   * 16/04/2021
  */
  purchase(purchase) {
    gtag('event', 'purchase', purchase);
  }
}