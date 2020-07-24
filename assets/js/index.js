function main(data, callback){

    var cl = {

        data: null,
        callback: null,

        init: function(data, callback){
            cl.data = data;
            cl.callback = callback;
            cl.listeners();
        },

        listeners: function(){

            document.querySelector("#submitFormBtn").addEventListener("click", function(e){
                e.preventDefault();
                cl.makeHttpRequest('GET', 'https://ltv-data-api.herokuapp.com/api/v1/records.json?email=doesmith@example.com', {}, 
                function(response){
                    console.log(response)
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