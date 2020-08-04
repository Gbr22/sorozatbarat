
import {UA, Login} from '../secret.json';


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
    var d = [
        {
            image:"https://static.sorozatbarat.online/covers/2195.jpg",
            title:"Rick és Morty (Rick and Morty)"
        },
        {
            image:"https://static.sorozatbarat.online/covers/4588.jpg",
            title:"Westworld"
        },
        {
            image:"https://static.sorozatbarat.online/covers/2195.jpg",
            title:"Rick és Morty (Rick and Morty)+"
        },
        {
            image:"https://static.sorozatbarat.online/covers/4588.jpg",
            title:"Westworld+"
        },
        {
            image:"https://static.sorozatbarat.online/covers/2195.jpg",
            title:"Rick és Morty (Rick and Morty)++"
        },
        {
            image:"https://static.sorozatbarat.online/covers/4588.jpg",
            title:"Westworld++"
        },
    ]
    var result = [
        {
            title:"Legfrissebb sorozataink",
            data:d,
        },
        {
            title:"Legnépszerűbb sorozataink",
            data:d,
        }
    ];
    return new Promise((r)=>{
        setTimeout(()=>{
            r(result);
        },100);
    })
}