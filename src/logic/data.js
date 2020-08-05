
import {UA, Login} from '../secret.json';
/* import cheerio from 'cheerio'; */
import cheerio from 'cheerio-without-node-native';
import { otherStyles } from '../styles';
import URI from 'urijs';

var data = {
    homepage:null,
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
function urlToAbsolute(url){
    return url.replace(/^\//,"https://www.sorozatbarat.online/").replace(/^\/\//,"https://");
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
    
    var description = "Az 1973-as Feltámad a vadnyugat című film alapján készült sorozat a jövőbe kalauzolja el a nézőt. Helyszíne egy kalandpark, ahol szép kis summáért vakációzhat a lakosság tehetősebb része. A parkban robotok teszik élvezetessé és emlékezetessé a vakációzást, s a látogató elutazhat az egyes történelmi korokba: vadnyugatra, az ókori Rómába vagy éppen a lovagi játékokon párbajozhat. Azonban egy nap az egyik android öntudatra ébred és fellázad...";
    
    
    
    
    return {
        description,
        tags,
        seasons,
        episodes,
        title,
        image,
        year
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