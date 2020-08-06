
import {UA, Login} from '../secret.json';
/* import cheerio from 'cheerio'; */
import cheerio from 'cheerio-without-node-native';
import { otherStyles } from '../styles';
import URI from 'urijs';

var data = {
    homepage:null,
}

var user = null;
export function getUser(){
    return user;
}

export async function getHomePageData(forceRefresh = false){
    if (!data.homepage || forceRefresh){
        return fetchHomePageData().then((d)=>{
            data.homepage = d;
            return d;
        })
    } else {
        return data.homepage;
    }
}


function chToArr(c){
    var a = [];
    c.each((i,e)=>{
        a[i] = e;
    })
    return a;
}
function chToChArr(c,$){
    var a = [];
    c.each((i,e)=>{
        a[i] = $(e);
    })
    return a;
}

export function login(username,password){
    var url = "https://www.sorozatbarat.online/login";
    var data = {
        login:username,
        password,
        loginsubmit: "Belépés",
        redirect:"/profile/"+username
    }
    function jsonToQuery(obj){
        var str = [];
        for (var p in obj){
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }

        return str.join("&");
    }
    return fetch(url, {
        method:"POST",

        headers: {
            "User-Agent":UA,
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:jsonToQuery(data)
    }).then(r=>{
        return r.text();
    })
}

function urlToAbsolute(url){
    return url.replace(/^\//,"https://www.sorozatbarat.online/").replace(/^\/\//,"https://");
}
export async function getAutocomplete(search){
    var url = "https://www.sorozatbarat.online/series/autocompleteV2?term="+escape(search);
    return fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    }).then(r=>{
        return r.json();
    }).then(json=>{
        json.forEach(e=>{
            e.url = urlToAbsolute(e.url);
        })
        return json;
    })

}
export async function getDetails(url){

    var response = await fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    });
    var url = new URI(response.url);
    var path = url.pathname();
    
    if (path == "" || path == "/"){
        throw Error("Sorozat nem található");
    }

    var text = await response.text();

    let $ = cheerio.load(text);

    var infoTable = $("#page .textcontent table");
    var img = infoTable.find(`img[alt]:not([alt=""])`);
    
    var image;

    var title;
    try {
        image = img.attr("src").replace(/^\/\//,"https://");
        title = img.attr("alt")
    } catch(err){
        image = "https://via.placeholder.com/136x200";
        title = "Hiba";
    }
    var year;
    try {
        year = $(infoTable.find(`img[alt*="év"]`)).parent().text().trim();
    } catch(err){
        year = "";   
    }
    var length;
    try {
        length = $(infoTable.find(`img[alt*="Időtartam"]`)).parent().text().trim();
    } catch(err){
        length = "";   
    }
    var imdb = null;
    try {
        imdb = urlToAbsolute($(infoTable.find(`img[alt*="imdb"]`)).parent().attr("href"));
    } catch(err){}

    var porthu = null;
    try {
        porthu = urlToAbsolute($(infoTable.find(`img[alt*="Port\.hu"]`)).parent().attr("href"));
    } catch(err){}
    
    

    var tags = [];
    infoTable.find(".tags a").each((i,e)=>{
        tags.push({
            title:$(e).text().trim(),
            url:$(e).attr("href")
        });
    })
    var seasons = [];
    var seasonsEl = $(".seasons li");
    seasonsEl.each((i,e)=>{
        let o = {
            title:$(e).text().trim(),
            url:urlToAbsolute($($(e).find("a")).attr("href")),
            active: $(e).hasClass("active")
        };
        seasons.push(o);
    });
    var episodes = [];
    var episodesEl = $(".episodes li.clearfix");
    episodesEl.each((i,e)=>{
        let o = {
            title:$($(e).find("a")).text().trim(),
            url:urlToAbsolute($($(e).find("a")).attr("href")),
        };
        episodes.push(o);
    });
    
    var description = "";
    description = infoTable.find(".tags").parent().find("p:not(.tags)").text().trim();
    
    
    
    
    return {
        description,
        tags,
        seasons,
        episodes,
        title,
        image,
        year,
        length,
        imdb,
        porthu
    }
}

export async function fetchHomePageData(){
    /* [...document.querySelectorAll(".thumbs")].map(e=>({e,children:e.querySelectorAll("ul li")})) */
    var url = /* "http://www.xhaus.com/headers" */ "https://www.sorozatbarat.online/";
    var text = await fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    }).then(r=>r.text());


    let $ = cheerio.load(text);
    
    var categories = chToArr($(".thumbs"));
    categories = categories.map(e=>{
        let o = {
            e,
            title:$(e).find("strong").text().replace(/\:$/,""),
            children: chToArr($(e).find("ul li")),
        }
        function getImage(element){
            var prop = element.css("background-image") || element.css("background");
            return prop.match(/url\((.*)\)/)[1].replace(/(^[\'\"])|([\'\"])$/g,"").replace(/^\/\//,"https://");
        }
        o.items = o.children.map(c=>{
            var anchor = $(c).find("a");
            return {
                title:$(c).text().trim(),
                image: getImage(anchor),
                url: anchor.attr("href").replace(/^\//,"https://www.sorozatbarat.online/")
            }
        });
        return o;
    }).filter(e=>e.children.length > 0);

    /* alert(categories[0].items[0].url); */

    
    var result = categories.map(e=>{
        return {
            title: e.title,
            data: e.items,
        }
    })
    return result;
}
export async function getMe(){
    if (user == null){
        user = await fetchMe();
        return user;
    }
    return user;
}
export async function fetchMe(){
    var url = /* "http://www.xhaus.com/headers" */ "https://www.sorozatbarat.online/";
    var text = await fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    }).then(r=>r.text());


    let $ = cheerio.load(text);

    var isLoggedIn = $(".user").text().indexOf("Belépés") == -1;

    if (user == null && isLoggedIn){
        $(".user #account").remove();
        $(".user p *").remove();

        var username = $(".user p").text().trim();
        user = await fetchUserData(username);
    }
    return user;
}


export async function fetchUserData(username){
    var url = "https://www.sorozatbarat.online/profile/"+username;
    var text = await fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    }).then(r=>r.text());


    let $ = cheerio.load(text);
    var avatar = urlToAbsolute($("#page .image img").attr("src"));
    return {
        username,
        avatar
    }
}