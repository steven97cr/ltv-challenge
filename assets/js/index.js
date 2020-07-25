function main(data, callback){

    var cl = {

        page: null,
        callback: null,

        init: function(data, callback){
            cl.data = data;
            cl.callback = callback;
            cl.listeners();
            cl.configPage();
        },

        configPage: function(){
            if(cl.page === "result"){
                if(localStorage.getItem('requestResult')){
                    cl.setResultInfo(JSON.parse(localStorage.getItem('requestResult')))
                }else{
                    //show error not found
                }
            }
        },

        setResultInfo: function(data){
            document.querySelector("#userPhoto").
        },

        toggleElement: function(selector){
            
            var el = document.querySelector(selector);
            if (el.style.display === "none") {
                el.style.display = "block";
            } else {
                el.style.display = "none";
            }
              
        },

        listeners: function(){

            document.querySelector("#submitFormBtn").addEventListener("click", function(e){
                //cl.toggleElement("#searchForm");
                //cl.toggleElement("#formLoader");
                e.preventDefault();
                cl.makeHttpRequest('GET', 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=doesmith@example.com', {}, 
                function(response){
                    if(response != "[]"){
                        console.log(response);
                        localStorage.setItem('requestResult', response);
                        window.location.href = './src/result'
                    }
                },
                function(err){
                    console.log(err)
                })
            });
              
        }, 

        makeHttpRequest: function(method, url, data, success, error){

            var cr = 'https://cors-anywhere.herokuapp.com/'; // this is a "hack" for cross origin request 

            var req = new XMLHttpRequest();
            req.onload = function(){success(req.response)};
            req.onerror = function(){error(req.response)};
            req.open(method, cr+url, true);
            req.send();
        },
    }

    cl.init(data, callback);
    return cl;
}