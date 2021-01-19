
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
import { AsyncStorage, Linking } from 'react-native';
import { checkForUpdateAsync } from 'expo-updates';

var data = {
    homepage:null,
}

export function getUser(){
    return user;
}

var history = [];
export function getHistory(){
    return history;
}
async function _getHistory(){
    let str = await AsyncStorage.getItem("search_history");
    try {
        let o = JSON.parse(str) || [];
        return o;
    } catch(err){}
    return [];
}
_getHistory().then(h=>history = h);

export async function addHistory(item) {
    history = history.filter(e=>e.url != item.url);
    history.push(item);
    await AsyncStorage.setItem("search_history",JSON.stringify(history));
}
export async function removeHistory(item) {
    history = history.filter(e=>e.url != item.url);
    await AsyncStorage.setItem("search_history",JSON.stringify(history));
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
export function formURLencode(data){
    const formBody = Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
    return formBody;
}
export function getDownloadURL(dlurl){
    return fetch(dlurl,{
        headers: {
            "User-Agent":UA,
        }
    }).then(r=>r.text()).then(html=>{
        let $ = cheerio.load(html);
        var pm = $("puremotion");
        var token = pm.attr("data-token");
        var url = pm.attr("data-url");
        var subtitles = JSON.parse(pm.attr("data-subtitle") || "[]");
        return fetch(url,{
            headers: {
                "User-Agent":UA,
            }
        }).then(r=>r.text()).then(embedhtml=>{
            var PUREMOTION_API = "https://www.thepuremotion.com/api.php";
            
            return fetch(PUREMOTION_API, {
                method: 'POST',
                headers: {
                    "User-Agent":UA,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Origin":"chrome-extension://jmkaieepcjnofkicafdelmdpigjdankd",
                },
                body: formURLencode({
                    token,
                    url,
                    d:"www.filmorias.com",
                    html:embedhtml
                })
            }).then(r=>r.json()).then(json=>{
                
                if (json.status == "error"){
                    throw new Error(json.message);
                }
                return {
                    videoUrl:json.videoUrl,
                    subtitles,
                };
            })
        })
    })
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
                puremotion: !!row[0].has("img.plugin").length,
                hd: !!row[0].has("img.hd").length,
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
let lastAutocomplete = {
    query:null,
    results:[],
};
export async function getAutocomplete(search){
    function normalize(s) {
        return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }
    var normalized = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    console.log("escaped",normalized);
    if (lastAutocomplete.query != null && search.indexOf(lastAutocomplete.query) == 0){
        return lastAutocomplete.results.filter(e=>{
            let q = normalize(search);
            
            function check(prop){
                if (!e[prop]){
                    return false;
                }
                return normalize(e[prop]).indexOf(q) != -1;
            }
            return check("label") || check("value");
        });
    } else {
        var url = URL_BASE+"/series/autocompleteV2?term="+escape(normalized);
        console.log("search query",url);
        let json = await fetch(url, {
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
        lastAutocomplete.query = search;
        lastAutocomplete.results = json;
        return json;
    }
    

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
    
    title = title.replace(`(${year})`,"");
    var originalTitle = title?.match(/ {0,1}\((.*?)\)/g)?.[0];
    if (originalTitle){
        title = title.replace(originalTitle,"");
        originalTitle = originalTitle.replace(" (","").replace(")","");
        originalTitle = originalTitle.replace(` (${year})`,"");
    }
    
    
    
    return {
        description,
        tags,
        seasons,
        episodes,
        title,
        originalTitle,
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
                    var spotlight = chToArr($("ul.haxordion li"));
                    spotlight = spotlight.map(e=>{
                        
                        return {
                            image:urlToAbsolute($(e).find("img").attr("src")),
                            url:urlToAbsolute($(e).find(".overlay a").first().attr("href")),
                            title:urlToAbsolute($(e).find(".overlay a").first().text().trim()),
                        }
                    })
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
                    
                    var result = {
                        spotlight,
                        categories:categories.map(e=>{
                            return {
                                title: e.title,
                                data: e.items,
                            }
                        }),
                    }
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