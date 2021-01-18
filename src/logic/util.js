import { Linking, PermissionsAndroid, Platform } from "react-native";
import SendIntentAndroid from "react-native-send-intent";
import { FileSystem } from "react-native-unimodules";

export function playVideo(url, subtitles_url, {title}){
    var fn = Platform.select({
        async android(){
            function getExt(path){
                let parts = path.split(".");
                return parts[parts.length-1];
            }
            let subtitlesPath = "";
            if (subtitles_url){
                /* subtitlesPath = "/storage/emulated/0/Download/subtitle."+getExt(subtitles_url); */
                subtitlesPath = FileSystem.cacheDirectory+"subtitle."+getExt(subtitles_url);
                
                await FileSystem.downloadAsync(subtitles_url,subtitlesPath);
            }
            subtitlesPath = subtitlesPath.replace("file:///","/").replace("file://","/");
            console.log("sub",url,subtitles_url,subtitlesPath);
            
            var extras = {"subtitles_location":subtitlesPath,"title":title};
            SendIntentAndroid.openAppWithData(
                /* "org.videolan.vlc" */null,
                url,
                "video/*",
                extras
            ).catch(err=>{});
        },
        default(){
            Linking.openURL(url).catch(err => {});
        }
    });
    return fn();
    
}