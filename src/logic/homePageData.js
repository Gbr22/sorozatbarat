
import {UA, Login} from '../secret.json';
/* import cheerio from 'cheerio'; */
import cheerio from 'cheerio-without-node-native';
import { otherStyles } from '../styles';

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