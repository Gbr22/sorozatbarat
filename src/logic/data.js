
import CookieManager from '@react-native-community/cookies';
import URL from 'url';
import UserAgent from 'react-native-user-agent';

var UA = "";
export function getUserAgent(){
    return UA;
}
export function getUA(params) {
    return new Promise((resolve,reject)=>{
        UserAgent.getWebViewUserAgent()
        .then(s => {
            UA = s;
            console.log("User Agent: ", UA);
            resolve();
        })
        .catch(e => {
            console.log("User Agent: ", UA);
            resolve();
        })
    })
}

var HOST = "www.sorozatbarat.club";
var URL_BASE = "https://www.sorozatbarat.club";
var URL_BASE_INDEX = "https://www.sorozatbarat.club/";

/* import cheerio from 'cheerio'; */
import cheerio from 'cheerio-without-node-native';
import { otherStyles } from '../styles';
import URI from 'urijs';
import { Linking } from 'react-native';

var data = {
    homepage:null,
}

export function getUser(){
    return user;
}

export async function getHomePageData(forceRefresh = false){
    return new Promise((resolve,reject)=>{
        if (!data.homepage || forceRefresh){
            fetchHomePageData().then((d)=>{
                data.homepage = d;
                resolve(d);
            }).catch(err=>{
                reject(err);
            })
        } else {
            resolve(data.homepage);
        }
    })
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

export async function logout(){
    var url = URL_BASE+"/logout";
    return fetch(url);
}
export async function login(username,password){
    var url = URL_BASE+"/login";
    var data = {
        login:username,
        password,
        loginsubmit: "Belépés",
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
        return CookieManager.get(URL_BASE_INDEX);
    }).then(c=>{
        var loggedIn = c.member;
        if (loggedIn){
            return;
        } else {
            throw new Error("Sikertelen bejelenetkezés");
        }
    })
}

function urlToAbsolute(url){
    if (url.indexOf("//") == 0){
        return url.replace("//","https://");
    }
    return url.replace(/^\//,URL_BASE_INDEX).replace(/^\/\//,"https://");
}
export function getPlayEndURL(referer,start){
    try {
        var FILMORIAS_BASE = "https://www.filmorias.com/ugras-a-videohoz/";
        var u = URL.parse(start);
        var id = u.pathname.replace("/video/redirect/","");
        var url = FILMORIAS_BASE+id;
        return new Promise(r=>r(url));
    } catch(err){
        console.warn("end url err",err);
    }
    
    /* return fetch(start, {
        redirect: "manual",
        headers:{
            "Referer":referer,
            "User-Agent":UA,
        }
    }).then(r=>{
        return r.url;
    }) */
}


export async function getLinks(url){
    
    var response = await fetch(url, {
        headers: {
            "User-Agent":UA,
        }
    });

    var text = await response.text();

    let $ = cheerio.load(text);

    var table = $(".episodes");
    
    var items = chToChArr(table.find("tr"),$);

    var title = $(".navTitle").text().trim()
    var episode = $("ul li.active").text().trim();
    
    items = items.map((e,i)=>{
        var row = chToChArr(e.find("td"),$);
        if (row.length <= 1) {
            return null;
        }
        var links = chToChArr(e.find("a"),$);
        
        if (links.length == 0){
            return null;
        }

        var o;
        
        try {
            var uploaderURL = row[1].find("a").attr("href");
            o = {
                title:row[1].text().trim().split("Feltöltő:")[0].trim(),
                uploader: uploaderURL ? {
                    url:uploaderURL ? urlToAbsolute(uploaderURL) : null,
                    username:row[1].find("a").text().trim(),
                } : null,
                lang:{
                    flag:urlToAbsolute(row[0].find("img.flags").attr("src")),
                    title:row[0].find("img.flags").attr("title"),
                },
                viewcount:row[2].text().trim(),
                url:urlToAbsolute(links[links.length-1].attr("href")),
            };
        } catch(err){
            alert(err);
        }
        return o;
        
        
        
    });
    items = items.filter(e=>e);

    return {
        url,
        items,
        episode,
        title,
    }
}
export async function getAutocomplete(search){
    var url = URL_BASE+"/series/autocompleteV2?term="+escape(search);
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
        var el = $(e);
        function getAction(action){
            return {
                value:action.hasClass("active"),
                url:urlToAbsolute(action.attr("href"))
            }
        }
        let o = {
            title:$($(e).find("a")).text().trim(),
            url:urlToAbsolute($($(e).find("a")).attr("href")),
            fav:getAction(el.find(".fav")),
            watched:getAction(el.find(".watched"))
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

export function fetchHomePageData(){
    return new Promise((resolve,reject)=>{
        var url = URL_BASE_INDEX;
        fetch(url, {
            headers: {
                "User-Agent":UA,
            }
        }).then(r=>{
            if (r.url.indexOf("login") != -1){
                reject("Not logged in");
            } else {
                r.text().then(text=>{
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
                                url: anchor.attr("href").replace(/^\//,URL_BASE_INDEX)
                            }
                        });
                        return o;
                    }).filter(e=>e.children.length > 0);
                    
                    var result = categories.map(e=>{
                        return {
                            title: e.title,
                            data: e.items,
                        }
                    })
                    resolve(result);
                })
            }
        });


    })
    
}
export function getHomePageText(){
    return new Promise((resolve,reject)=>{
        var url = URL_BASE_INDEX;
        fetch(url, {
            headers: {
                "User-Agent":UA,
            }
        }).then(r=>{
            if (r.url.indexOf("login") != -1){
                reject("Not logged in");
            } else {
                resolve(r.text());
            }
        });
    });
}
export async function fetchMe(){
    return new Promise((resolve,reject)=>{
        /* CookieManager.get(URL_BASE_INDEX).then(e=>{
            console.log(e);
        }) */
        getHomePageText().then(async (text)=>{
            let $ = cheerio.load(text);
            
            var user = null;
            $(".user #account").remove();
            $(".user p *").remove();

            var username = $(".user p").text().trim();
            console.log("username",username);
            user = await fetchUserData(username);
            resolve(user);
        }).catch(err=>{
            reject(err);
            return;
        })
    })
}


export async function fetchUserData(username){
    var url = URL_BASE+"/profile/"+username;
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