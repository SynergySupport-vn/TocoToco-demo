const Alert = {
  showAlert: function (message, time = 3000, className = 'alert-success') {
    var alertHTML = jQuery(`<div class='alert-wrap'>
                          <div class="alert ${className}" role="alert">
                            ${message}
                            <i class="fas fa-times"></i>
                          </div>
                        </div>`);
    jQuery('body').append(alertHTML);

    alertHTML.find('i').click(function () {
      alertHTML.remove();
    })

    setTimeout(() => {
      alertHTML.remove();
    }, time);
  },

  success: function (message, time = 3000) {
    this.showAlert(message, time, 'alert-success');
  },

  warning: function (message, time = 3000) {
    this.showAlert(message, time, 'alert-warning');
  },

  error: function (message, time = 3000) {
    this.showAlert(message, time, 'alert-danger');
  }
}


