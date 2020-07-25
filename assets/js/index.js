function main(data, callback){

    var cl = {

        page: null,
        callback: null,

        init: function(data, callback){
            cl.page = data.currentPage;
            cl.callback = callback;
            cl.listeners();
            cl.configPage();
        },

        configPage: function(){
            if(cl.page === "result"){
                console.log('result')
                if(localStorage.getItem('requestResult')){
                    cl.setResultInfo(JSON.parse(localStorage.getItem('requestResult')))
                    localStorage.clear();
                }else{
                    document.querySelector("#searchResultContainer").style.display = "none";
                    document.querySelector("#searchErrorContainer").style.display = "block";
                }
            }
        },

        setResultInfo: function(data){
            document.querySelector("#userPhoto").style.backgroundImage = "url('"+(data.image ? data.image : '../../assets/img/userDefault.png')+"')";
            document.querySelector("#userName h2").innerHTML = (data.first_name +" "+data.last_name); 
            document.querySelector("#userName span").innerHTML = data.description ? data.description : '';
            document.querySelector("#userInfoAddressSection").innerHTML += data.address ? ("<p class='userInfoText'>"+data.address+"<p>") : 'Not provided';
            document.querySelector("#userInfoEmailSection").innerHTML += data.email ? ("<p class='userInfoText'>"+data.email+"<p>") : 'Not provided';

            document.querySelector("#userInfoPhoneSection").innerHTML += data.phone_numbers ? cl.getPhonesHtml(data.phone_numbers) : 'Not provided';
            document.querySelector("#userInfoRelativesSection").innerHTML += data.relatives ? cl.getRelativesHtml(data.relatives) : 'Not provided';
        },

        getPhonesHtml: function(phones){
            var html = '';
                console.log(phones)
            for(var i = 0; i < phones.length; i++){
                html += "<a href='tel:"+phones[i]+"'>"+phones[i]+"</a><br>";
            }
                
            return html;
        },

        getRelativesHtml: function(relatives){
            var html = '';
                console.log(relatives)
            for(var i=0; i < relatives.length; i++){
                html += "<p class='userInfoText'>"+relatives[i]+"</p>";
            }
            return html;
        },

        toggleElement: function(selector){
            
            var el = document.querySelector(selector);
            if (el.style.display === "none") {
                el.style.display = "block";
            } else {
                el.style.display = "none";
            }
              
        },

        valitateEmailInput: function(selector){
            var out = false;
            var input = document.querySelector(selector);
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.value)){
                out = true;
            }else{
                input.style.border = "1px red solid";
                document.querySelector(".spanTextError").style.display = "block";
                setTimeout(function(){
                    input.style.border = "1px whitesmoke solid";
                    document.querySelector(".spanTextError").style.display = "none";
                },4000)
            }
            return out;
        },

        searchEmail: function(){
            if(cl.valitateEmailInput("#searchInput")){
                document.querySelector("#searchForm").style.display = "none";
                document.querySelector('#searchFormErrorContainer').style.display = "none"
                document.querySelector("#formLoader").style.display = "block";
                var val = document.querySelector("#searchInput").value;
                cl.makeHttpRequest('GET', 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email='+val, {}, 
                function(response){
                    if(response != "[]"){
                        console.log(response);
                        localStorage.setItem('requestResult', response);
                        if(cl.page == "result"){
                            document.location.reload();
                        }else{
                            window.location.href = './src/result/index.html';
                        }
                    }else{
                        document.querySelector("#formLoader").style.display = "none";
                        document.querySelector("#searchFormErrorContainer").style.display = "block"
                        document.querySelector("#searchForm").style.display = "block";
                        
                    }
                },
                function(){
                    alert("Request error!")
                });
            }
        },

        listeners: function(){

            document.querySelector("#submitFormBtn").addEventListener("click", function(e){
                e.preventDefault();
                cl.searchEmail();
            });
              
        }, 

        makeHttpRequest: function(method, url, data, success, error){

            var cr = 'https://cors-anywhere.herokuapp.com/'; // this is a "hack" for cross origin request 

            var req = new XMLHttpRequest();
            req.onload = function(){success(req.response)};
            req.onerror = function(){error()};
            req.open(method, cr+url, true);
            req.send();
        },
    }

    cl.init(data, callback);
    return cl;
}