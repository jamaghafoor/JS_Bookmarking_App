let body = document.body;
        let input = document.querySelector('input[type = text]');
        let overlay = document.querySelector('.overlay');
        apiUrl = 'https://opengraph.io/api/1.1/site/';
        appId = '7ecdebc6-001d-455d-922a-12009b5afac2';
        myUrl = encodeURIComponent(
            'https://scotch.io/tutorials/find-fix-and-prevent-terraform-misconfigurations-with-bridgecrew');
        /**
         ** Displaying annd Closing floater */
        function showFloater() {
            body.classList.add('show-floater');
        }
        input.addEventListener('focusin', showFloater);

        function closeFloater() {
            body.classList.remove('show-floater');
        }
        overlay.addEventListener('click', closeFloater)
        /**
         * *Getting Dom Elements*/
        let bookmarkList = document.querySelector('.bookmark-list')
        let bookmarkForm = document.querySelector('.bookmark-form');
        let formInput = bookmarkForm.querySelector('input[type = text]');
        let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        fillBookmarkList(bookmarks);
        /**
         * *Creating Bookmark*/
        function creatBookmark(e) {
            e.preventDefault();
            if (!formInput.value) {
                swal({
                    title: "Empty URL!",
                    text: "please! enter a link or url",
                    icon: "warning",
                    button: "Ok",
                    dangerMode: true
                });
                return;
            }
            let url = encodeURIComponent(formInput.value);

            fetch(apiUrl + url + '?app_id=' + appId)
                .then(response => {
                    return response.json();
                }).then(data => {
                    let title = formInput.value;
                    let bookmark = {
                        title: data.hybridGraph.title,
                        image: data.hybridGraph.image,
                        link: data.hybridGraph.url
                    };
                    bookmarks.push(bookmark);
                    fillBookmarkList(bookmarks);
                    storeBookmarks(bookmarks);
                    bookmarkForm.reset();
                    swal({
                        title: "Great job",
                        text: "Record has been added successfully!",
                        icon: "success",
                        button: "Ok!",
                    });
                    setTimeout(() => {
                        closeFloater();
                    }, 1000);
                }).catch(error => {
                    swal({
                        title: "Oops!",
                        text: "Your url is not correct!",
                        icon: "warning",
                        button: "Ok",
                        dangerMode: true
                    })
                });
        }
        /**
         * * Filling the Array with Bookmarks */
        function fillBookmarkList(bookmarks = []) {
            let bookmarksHtml = '';
            for (let i = 0; i < bookmarks.length; i++) {
                bookmarksHtml += `
                        <div class="col-lg-2 col-md-3 col-sm-4">
                            <div class="card card-block">
                                <a href="${bookmarks[i].link}" class="bookmark" target="_blank">
                                <h4 class="card-title text-right" data-id="${i}"><i class="material-icons">clear</i></h4>
                                <img src="${bookmarks[i].image}"
                                        alt="Photo of sunset">
                                    <h5 class="card-title mt-3 mb-3">${bookmarks[i].title}</h5>
                                </a>
                            </div>
                        </div>
                `;
            }
            bookmarkList.innerHTML = bookmarksHtml;
        }
        /**
         * *Storing Bookmarks in the local storage*/
        function storeBookmarks(bookmarks = []) {
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
        /**
         * *Removing Bookmark from Local Storage*/
        function removeBookmark(e) {
            if (!e.target.matches('.material-icons')) {
                return;
            }
            let index = e.target.parentNode.dataset.id;
            bookmarks.splice(index, 1);
            fillBookmarkList(bookmarks);
            storeBookmarks(bookmarks);
            e.preventDefault();
        }

        bookmarkForm.addEventListener('submit', creatBookmark);
        bookmarkList.addEventListener('click', removeBookmark);