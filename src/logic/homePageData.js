
import {UA, Login} from '../secret.json';
/* import cheerio from 'cheerio'; */
import cheerio from 'cheerio-without-node-native';
import { otherStyles } from '../styles';

var data = {
    homepage:null,
}

export async function getHomePageData(){
    if (!data.homepage){
        return fetchHomePageData().then((d)=>{
            data.homepage = d;
            return d;
        })
    } else {
        return data.homepage;
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

    function chToArr(c){
        var a = [];
        c.each((i,e)=>{
            a[i] = e;
        })
        return a;
    }
    
    var categories = chToArr($(".thumbs"));
    categories = categories.map(e=>{
        let o = {
            e,
            title:$(e).find("strong").text(),
            children: chToArr($(e).find("ul li")),
        }
        function getImage(element){
            var prop = element.css("background-image") || element.css("background");
            return prop.match(/url\((.*)\)/)[1].replace(/(^[\'\"])|([\'\"])$/g,"").replace(/^\/\//,"https://");
        }
        o.items = o.children.map(c=>{
            return {
                title:$(c).text().trim(),
                image: getImage($(c).find("a")),
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
    return result;
}