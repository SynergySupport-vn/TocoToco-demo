var nav = document.querySelector('nav');


window.addEventListener('scroll', function () {
if (window.pageYOffset > 100) {
    nav.classList.remove('navbar-carousel');
    nav.classList.add('bg-dark', 'sticky-top');
} else {
    nav.classList.remove('bg-dark', 'sticky-top');
    nav.classList.add('navbar-carousel');
}
});

document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        // load more data belike pagination
        if(e.target && e.target.id== 'viewMore') {
            e.preventDefault();
            const categoryId = parseInt(e.target.getAttribute('data-cat-id'));
            const dataPage = parseInt(e.target.getAttribute('data-page'));
            const postContent = document.querySelector('#location-' + categoryId);
            const loading = e.target.querySelector('#loading');
            loading.style.display = 'inherit';
            e.target.setAttribute('disabled', true);

            var formData = new FormData();
            formData.append("action", "LoadJobPagination");
            formData.append("data_page", dataPage);
            formData.append("posts_per_page", 8);
            formData.append("city_id", categoryId);
            
            const data = new URLSearchParams(formData);
        
            fetch(window.ajaxUrl, {
                method: 'POST',
                body: data,
            }).then(function (response) {
                return response.text();
            }).then(function (data) {
                e.target.setAttribute('data-page', dataPage + 1);
                let content = postContent.innerHTML;
                postContent.innerHTML = content + data;
                if (!data) e.target.style.display = 'none';
            }).catch(function (error) {
                console.log('error: ', error);
            }).finally(function () {
                loading.style.display = 'none';
                e.target.removeAttribute('disabled');
            });
        }
    });
  });

document.addEventListener('click', function (event) {
    if (event.target.matches('.navbar-toggler') || event.target.matches('.navbar-toggler-icon')) {
        if (window.pageYOffset <= 100) {
            nav.classList.toggle('navbar-carousel');
            nav.classList.toggle('bg-dark', 'sticky-top');
        }
    }


}, false);

function goBack() {
	window.history.back();
}