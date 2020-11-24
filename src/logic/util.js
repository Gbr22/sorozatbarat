import { Linking, Platform } from "react-native";
import SendIntentAndroid from "react-native-send-intent";

export function playVideo(url, subtitles_url){
    var fn = Platform.select({
        android(){
            var extras = subtitles_url ? {}:{"subtitles_location":subtitles_url}
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
    fn();
    
}