"use strict"

var base_url="https://www.googleapis.com/customsearch/v1/?cx=3aa6849e6b84636a4&key=AIzaSyCq6mzVIl0WfEiTP7YRfKWd2xXFUBJhzeY&q="
var current_query=''
var count=10

// Api calling to search query
function api_call(query,start_from=1){
    if(query!=""){
        let url = base_url + query+"start="+start_from;
        fetch(url,{
            method:'GET',
            headers:{
                'Content-Type':'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data['queries']['request'][0]['startIndex']==1){
                let pagination_items = paginatiom_item_container.getElementsByTagName('a');
                pagination_items[0].text =  1;
                pagination_items[1].text =  2;
                pagination_items[2].text =  3;
            }
            data_formating(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }
}


// adding result in html
function data_formating(data){
    let images_section = document.getElementById("images_section");
    let result_list = document.getElementsByClassName('resultList')[0];
    images_section.innerHTML="";
    result_list.innerHTML="";
    let web_result_items = data['items'];
    for (let item of web_result_items){
        let item_title = item['title'];
        let display_url = item['displayLink'];
        let description = item['snippet'];

        try{
            let image_url = item['pagemap']['cse_thumbnail'][0]['src'];
            let img_item = '<div class="col-sm-6 col-md-6 col-lg-4">\
        <img src='+image_url+' class="img-fluid" alt="image Result">\
        </div>';
        images_section.innerHTML+=img_item;
        }
        catch(error){}
        

        let result_item = `<li>
                        <a href="javascript:void(0)">
                            <div class="title">${item_title}</div>
                            <div class="url-link">${display_url}</div>
                        </a>
                        <div class="description">
                            ${description}
                        </div>
                    </li>`;
        
        result_list.innerHTML+=result_item;
    }
}


var submit_button = document.getElementsByTagName('button')[0];

submit_button.onclick = function(event){
    let input = document.getElementsByTagName('input')[0];
    let query = input.value;
    current_query = query;
    api_call(query);
}

var paginatiom_item_container=document.getElementsByClassName('pagination-item')[0];

var pagination_items = paginatiom_item_container.getElementsByTagName('a');


// updating paginatioin links 
for (let item of pagination_items){
    item.onclick = function(e){
        let clicked_link=e.target.id;
        let page_no = parseInt(e.target.text);
        let start = ((page_no-1)*count)+1;
        api_call(current_query,start);

        if(clicked_link==="first" && page_no!=1){
            let pagination_items = paginatiom_item_container.getElementsByTagName('a');
            pagination_items[0].text =  parseInt(pagination_items[0].text)-1;
            pagination_items[1].text =  parseInt(pagination_items[1].text)-1;
            pagination_items[2].text =  parseInt(pagination_items[2].text)-1;
        }
        if(clicked_link==="third" && page_no!=10){
            let pagination_items = paginatiom_item_container.getElementsByTagName('a');
            pagination_items[0].text =  parseInt(pagination_items[0].text)+1;
            pagination_items[1].text =  parseInt(pagination_items[1].text)+1;
            pagination_items[2].text =  parseInt(pagination_items[2].text)+1;
        }
    };
}