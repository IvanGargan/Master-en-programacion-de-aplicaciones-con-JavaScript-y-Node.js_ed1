(function() {
    const URL_ITUNES = "https://itunes.apple.com/search?entity=song&";
    
    var ajax = {
        request: function(url, callback) {
            var xmlHttp = new XMLHttpRequest();
            
            loader.load();
            
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4 && xmlHttp.status === 200) {
                    callback(JSON.parse(xmlHttp.responseText));
                } else if (xmlHttp.readyState === 4 && xmlHttp.status === 404) {
                    console.error("ERROR! 404");
                    console.info(JSON.parse(xmlHttp.responseText));
                }
            };
            xmlHttp.open("GET", url, true);
            xmlHttp.send();
        }
    }
    
    var itunes = {
        search: function() {
            document.querySelector(".search-button").addEventListener("click", function() {
                if(utils.validator()) {
                    var url = "";
                    var query = document.querySelector(".search-bar").value;
                    var limit = document.querySelector(".search-limit-bar").value;
                    
                    limit = limit === "" ? limit : "&limit=" + limit;
                    
                    url = URL_ITUNES + "term=" + query + limit;
                    
                    ajax.request(url, itunes.setHTML);
                    
                    loader.delete();
                }
            });
        },
        setHTML: function(json) {
            console.log(json);
            var html = "";
            document.querySelector(".music-container").innerHTML = "";
            
            json.results.forEach(function(e, i) {
                html += "<div class='music-box'>" +
                            "<div class='music-image'>" +
                                "<img src='" + e.artworkUrl30 + "' />" +
                            "</div>" +
                            "<div class='track-name'>" +
                                "<span>" + e.trackName + "</span>" +
                            "</div>"+
                            "<div class='track-time'>" +
                                "<span>" + utils.setTime(e.trackTimeMillis) + "</span>" +
                            "</div>" +
                            "<div class='artist-link'>" +
                                "<a href='" + e.artistViewUrl + "' title='Ver página del artista' target='_blank'>" + e.artistName + "</a>" +
                            "</div>" +
                            "<div class='links'>" +
                                "<a href='" + e.trackViewUrl + "'title='Ver álbum' target='_blank'><img src='img/icon-eye.svg'/></a>" +
                            "</div>" +
                        "</div>";
            });
            
            document.querySelector(".music-container").innerHTML = html;
        }
    }

    var loader = {
        load: function() {
            if(!document.querySelector(".loader")) {
                document.querySelector("body").innerHTML += '<div class="loader"><svg width="100" height="100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-cube"><g transform="translate(25,25)"><rect x="-20" y="-20" width="40" height="40" fill="#999999"><animateTransform attributeName="transform" type="scale" calcMode="spline" values="1.5;1" keyTimes="0;1" dur="1s" keySplines="0 0.5 0.5 1" begin="-0.3s" repeatCount="indefinite"></animateTransform></rect></g><g transform="translate(75,25)"><rect x="-20" y="-20" width="40" height="40" fill="#ebebeb"><animateTransform attributeName="transform" type="scale" calcMode="spline" values="1.5;1" keyTimes="0;1" dur="1s" keySplines="0 0.5 0.5 1" begin="-0.2s" repeatCount="indefinite"></animateTransform></rect></g><g transform="translate(25,75)"><rect x="-20" y="-20" width="40" height="40" fill="#ebebeb"><animateTransform attributeName="transform" type="scale" calcMode="spline" values="1.5;1" keyTimes="0;1" dur="1s" keySplines="0 0.5 0.5 1" begin="0s" repeatCount="indefinite"></animateTransform></rect></g><g transform="translate(75,75)"><rect x="-20" y="-20" width="40" height="40" fill="#999999"><animateTransform attributeName="transform" type="scale" calcMode="spline" values="1.5;1" keyTimes="0;1" dur="1s" keySplines="0 0.5 0.5 1" begin="-0.1s" repeatCount="indefinite"></animateTransform></rect></g></svg><p><strong>Estamos cargando su contenido...</strong></p></div>';
                itunes.search();
            }
        },
        delete: function() {
            if(document.querySelector(".loader")) {
                setTimeout(function() {
                    document.querySelector(".loader").remove();
                }, 1500);
            }
        }
    }
    
    var utils = {
        validator: function() {
            var querySearchInput = "", queryLimitSearchInput = "";
            
            if(document.querySelector(".search-bar")) {
                querySearchInput = document.querySelector(".search-bar").value;
            } else {
                return false;
            }
            
            if(document.querySelector(".search-limit-bar")) {
                queryLimitSearchInput = document.querySelector(".search-limit-bar").value;
            } else {
                return false;
            }
            
            querySearchInput = querySearchInput.trim().toString();
            queryLimitSearchInput = queryLimitSearchInput.trim().toString();
            
            if(querySearchInput === "") { 
                alert("El campo de búsqueda no debe estar vacío.");
                return false;
            }
            
            if(queryLimitSearchInput !== "" && isNaN(queryLimitSearchInput)) {
                alert("El campo límite solo acepta números");
                return false;
            }
            
            return true;
        },
        setTime: function(time) {
            var date = new Date(time);
            var minutes = "", seconds = "";
            
            minutes = date.getMinutes() <= 9 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();
            seconds = date.getSeconds() <= 9 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();
            
            return minutes + ":" + seconds;
        }
    }
    
    itunes.search();
})();