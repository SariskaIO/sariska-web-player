import { useLocation } from "react-router-dom";
import OvenPlayer from 'ovenplayer';
import {GENERATE_TOKEN_URL, GET_PRESIGNED_URL, LIVE_STREAMING_START_URL, LIVE_STREAMING_STOP_URL} from "../constants";
import linkifyHtml from 'linkify-html';
import { MESSAGING_API_SERVICE_HOST, SARISKA_API_KEY } from "../config";

const Compressor = require('compressorjs');

export function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function getMeetingId() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(9).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("-");
}

export function getUserId() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(9).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("-");
}

export function getJitsiMeetGlobalNS() {
    if (!window.SariskaMediaTransport) {
        window.SariskaMediaTransport = {};
    }

    if (!window.SariskaMediaTransport.app) {
        window.SariskaMediaTransport.app = {};
    }

    return window.SariskaMediaTransport.app;
}


export function createDeferred() {
    const deferred = {};

    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
}

export async function getToken(profile, name, avatarColor, isApiKey, apiKey, id) {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: isApiKey ?apiKey : process.env.REACT_APP_SARISKA_MEET_APP_API_KEY,
            user: {
                avatar: avatarColor,
                name: name,
                email: profile.email,
                id: id
            },
            exp: "48 hours"
        })
    };

    
    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            localStorage.setItem("SARISKA_TOKEN", json.token);
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log('error', error);
    }
}


export const getMessagingToken = async (username, userId)=> {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: `${SARISKA_API_KEY}`, // enter your app secret,
            user: {
                id: userId,
                name: username
            },
        })
    };

    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log(error);
    }

}

export async function startStreamingInSRSMode(roomName, streamingFlag) {
    let params = {
        room_name: roomName
    };
    if(!streamingFlag?.length){
        params['normal_latency'] = true;
    }else {
        if(streamingFlag.includes('is_low_latency')){
            params['is_low_latency'] = true;
        }
        if(streamingFlag.includes('multi_bitrate')){
            params['multi_bitrate'] = true;
        }
        if(streamingFlag.includes('is_vod')){
            params['is_vod'] = true;
        }
    }
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("SARISKA_TOKEN")}`
        },

        body: JSON.stringify(params)
    };
    try {
        const response = await fetch(LIVE_STREAMING_START_URL, body);
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            console.log(response.message);
        }
    } catch (error) {
        console.log('error', error);
    }
}

export async function stopStreamingInSRSMode(roomName) {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("SARISKA_TOKEN")}`
        },
        body: JSON.stringify({
            room_name: roomName
        })
    };
    try {
        const response = await fetch(LIVE_STREAMING_STOP_URL, body);
        if (response.ok) {
            const json = await response.json();
            return json;
        } else {
            console.log("Got some error in stopping streaming");
        }
    } catch (error) {
        console.log('error', error);
    }
}

export const getUserById = (id, conference) => {
     if (id === conference.myUserId()) {
         return conference.getLocalUser()
     }
     return conference?.participants[id]?._identity?.user
}

export const clearAllTokens = () => {
    Object.entries(localStorage).map(x => x[0]).filter(
            x => x.substring(0,8)==="sariska_"
        ).map(
            x => localStorage.removeItem(x))
}

export function isSquare  (n) {
    return n > 0 && Math.sqrt(n) % 1 === 0;
};

export function  calculateSteamHeightAndExtraDiff(viewportWidth, viewportHeight, documentWidth, documentHeight, isPresenter, isActiveSpeaker)  {
    let videoStreamHeight = viewportHeight, videoStreamDiff = 0;
    if (isPresenter) {
        return {videoStreamHeight: viewportHeight, videoStreamDiff: 0};
    }
    if ( viewportWidth > documentWidth) {
        return {videoStreamHeight: documentWidth*9/16, videoStreamDiff: 0};
    }
    if ( viewportHeight * (16 / 9)  < viewportWidth )  {
        let diff = viewportWidth - viewportHeight*16/9;
        videoStreamHeight =  (viewportHeight * 16 / 9 + diff)*9/16;
        videoStreamDiff = viewportHeight * 16 / 9 + diff - viewportWidth;
    } else {
        videoStreamDiff =  viewportHeight * 16 / 9  - viewportWidth;
    }
    return { videoStreamHeight, videoStreamDiff };
}

export function calculateRowsAndColumns(totalParticipant) {
    let columns = totalParticipant > 1 ? 2 : 1;
    let rows = totalParticipant > 2 ? 2 : 1;
    let gridItemWidth = 320, gridItemHeight = 240;

    return  { 
        rows, 
        columns, 
        gridItemWidth, 
        gridItemHeight
    }
} 

export function isMobile() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
}

export function isPortrait(){
    return window.innerWidth <=620 ? true : false;
}

export function isTab(){
    return (window.innerWidth >620 && window.innerWidth <960)  ? true : false;
}

export function isMobileOrTab(){
    return window.innerWidth <960 ? true : false;
}

export function getLeftTop(i,  j,  gridItemWidth, gridItemHeight, rows, participantCount){
    let left, top; 
    if ( (rows - 1 ) === i) {
            left = 12 + j * gridItemWidth + j*12;
    } else {
        left  = 12 + (j * gridItemWidth) +  j*12;
    }
    top  =   (i *  gridItemHeight + i*12);
    return { left, top };
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getIntialUpperCaseString = (string) => {
    if(string){
        return string.slice(0,1).toUpperCase()
    }else{
        return ''
    };
}

export function videoShadow(level) {
    const scale = 2;

    // Internal circle audio level.
    const int = {
        level: level > 0.15 ? 20 : 0,
        color: "rgba(255,255,255,0.4)"
    };

    // External circle audio level.
    const ext = {
        level: parseFloat(
            ((int.level * scale * level) + int.level).toFixed(0)),
        color: "rgba(255,255,255,0.2)"
    };

    // Internal blur.
    int.blur = int.level ? 2 : 0;

    // External blur.
    ext.blur = ext.level ? 6 : 0;

    return [
        `0 0 ${int.blur}px ${int.level}px ${int.color}`,
        `0 0 ${ext.blur}px ${ext.level}px ${ext.color}`
    ].join(', ');
}

export function getWhiteIframeUrl(conference) {
    return `https://whiteboard.sariska.io/boards/${conference.connection.name}?authorName=${conference.getLocalUser().name}`;     
}

export function isFullscreen(){
    let isInFullScreen =
    (document.fullscreenElement && document.fullscreenElement !== null) ||
    (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
    (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
    (document.msFullscreenElement && document.msFullscreenElement !== null);   
    return isInFullScreen;
}

export function requestFullscreen() {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }
}

export function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

export function getSharedDocumentIframeUrl(conference) {
    return `https://etherpad.sariska.io/p/${conference.connection.name}?userName=${conference.getLocalUser().name}&showChat=false&showControls=false&chatAndUsers=false`;     
}

export function appendLinkTags(type, conference) {
    var preloadLink = document.createElement("link");
    preloadLink.href = type === "whiteboard" ? getWhiteIframeUrl(conference) : getSharedDocumentIframeUrl(conference);
    preloadLink.rel = "preload";
    preloadLink.as = "document";
    document.head.appendChild(preloadLink);
}

export function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}

export function preloadIframes(conference) {
    appendLinkTags("whiteboard", conference);
    appendLinkTags("sharedDocument", conference);
}

export const trimSpace = (str) => {
    return str.replace(/\s/g,'');
}

export const detectUpperCaseChar = (char) => {
    return char === char.toUpperCase() && char !== char.toLowerCase();
}

export const linkify=(inputText) =>{
    const options = { defaultProtocol: 'https',   target: '_blank'};
    return linkifyHtml(inputText, options);
}

export function encodeHTML(str){
    return str.replace(/([\u00A0-\u9999<>&])(.|$)/g, function(full, char, next) {
        if(char !== '&' || next !== '#'){
            if(/[\u00A0-\u9999<>&]/.test(next))
                next = '&#' + next.charCodeAt(0) + ';';

            return '&#' + char.charCodeAt(0) + ';' + next;
        }

        return full;
    });
}


export function getPresignedUrl(params) {
    return new Promise((resolve, reject) => {
        let token;
        if(params.chat){
            token = JSON.parse(localStorage.getItem("SARISKA_CHAT_TOKEN"));
        }else{
            token = localStorage.getItem("SARISKA_TOKEN");
        }
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fileType: params.fileType,
                fileName: params.fileName
            })
        };

        fetch(GET_PRESIGNED_URL, body)
            .then((response) => {
                if (response.ok) {
                    return response.json(); //then consume it again, the error happens
                }
            })
            .then(function (response) {
                resolve(response);
            }).catch((error) => {
            reject(error)
        })
    });
}

export function compressFile(file, type) {
    return new Promise((resolve, reject) => {
        if (type === "attachment") {
            resolve(file);
        } else {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    reject(err.message);
                }
            });
        }
    });
}

export function getUniqueNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}


export function formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 3; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}

export const getParticipants = (conference, localUser) => {
    return [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }]
}


export const getObjectKeysLength = (url) => {
    return Object.keys(url)?.length;
  }

  export function extractStreamFromUrl(url) {
    if (!url){
        return;
    }

    if (!isURL(url)) {
        return
    }

    const pathname = new URL(url).pathname;
    const parts  = pathname.split("/");

    if (parts[1] === "play") {
        return parts[3];
    } else if (parts[1] === "multi") {
        return parts[3]
    } else if (parts[1] ===  "original") {
        return parts[3]
    } else if(parts[1]) {
        return parts[1]
    }
    return null;  
}

export function isURL(str) {
    var urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
    var url = new RegExp(urlRegex, 'i');
    return str.length < 2083 && url.test(str);
}

// Function to load video
export function loadVideo(url, isPlay) {
    var storedUrl = document.getElementById('hlsUrlInput').value || localStorage.getItem('hlsUrl')
    if (storedUrl) {
        document.getElementById('hlsUrlInput').value = storedUrl;
        localStorage.setItem('hlsUrl', storedUrl);
    }
    
    let player = OvenPlayer.create("player_container", {
            autoStart: true,
            sources: [{
                label: 'low latency hls',
                type: 'hls',
                id: 'video',
                file: storedUrl
            }]
        });
    // Reload OvenPlayer when an error occurs.
    player.on('error', function (e) {
        // Wait 1 sec and reload.
        console.log("error", e);
    });

    function updateQuality() {
        const selectElement = document.getElementById("quality_selector");
        const selectedQuality = selectElement.value;
        player.setQuality(selectedQuality);
    }

    // Function to show/hide settings panel
    function toggleSettings() {
        const settingsPanel = document.getElementById("settings_panel");
        settingsPanel.classList.toggle("hidden");
    }
    setInterval(updateViewerCount, 10000);
}

// Function to update the viewer count
export function updateViewerCount() {
    var storedUrl = localStorage.getItem('hlsUrl');
    var stream = extractStreamFromUrl(storedUrl);
    var viewerUrl = "https://api.sariska.io/llhls/v1/hooks/srs/live/viewers/count/";

    var requestUrl = viewerUrl + stream;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            const count = data["stream:"+stream].current_viewers;
            const uptime = data["stream:"+stream].uptime;
            document.getElementById('viewerCount').innerText = "Currently Viewing " + count + " people and stream started streaming " +timeElapsed(uptime)  
        })
        .catch(error => {
            console.error('Error fetching viewer count:', error);
        });
}

export function timeElapsed(timestamp) {
    const elapsedTime = timestamp; // Convert milliseconds to seconds

    if (elapsedTime < 60) {
        return `${Math.floor(elapsedTime)} seconds ago`;
    } else if (elapsedTime < 3600) {
        const minutes = Math.floor(elapsedTime / 60);
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (elapsedTime < 86400) {
        const hours = Math.floor(elapsedTime / 3600);
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
        const days = Math.floor(elapsedTime / 86400);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
}

export const renderAction = (type, payload) => {
    if(payload){
        return {
            type,
            payload
        }
    }else{
        return {
            type
        }
    }
}

export async function apiCall(path, method, body = {}, headers = {}, loader=false) {
    let url = `${MESSAGING_API_SERVICE_HOST}${path}`;
    const requestHeaders = {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${
            JSON.parse(localStorage.getItem("SARISKA_CHAT_TOKEN"))
        }`,
        ...headers
    };
    if (method.toUpperCase() === "GET" && Object.keys(body).length) {
        const queryString = new URLSearchParams(body).toString();
        url = `${url}?${queryString}`;
    }
    
    const payload = {
        method,
        headers: requestHeaders,
    };
    if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
        payload.body = JSON.stringify(body);
    }
  
    try {
        const response = await fetch(url, payload);
        if (response.status === 401) {
            console.log('not authenticated');
        }
  
        if (response.status === 403 && method.toUpperCase() !== "GET") {
            console.log('not autherized');
        }
  
        if (response.status === 204) {
            return {};
        }
        if (response.ok) {
            return await response.json();
        }
        return {
            httpStatus: response.status,
            statusText: response.statusText,
            body: await response.json(),
        };
    } catch (error) {
        return {error, httpStatus: 500};
    }
  }

  export const isEmptyObject = (obj) => {
    if(typeof obj !== 'object' ) return false;
    return Object.keys(obj).length === 0;
  };

//   export const pushMessage = (message, options, type, user, setMessages, chatChannel)=>{
     
//       const new_message =  {
//         content: message, 
//         content_type: type, 
//         created_by_name: user.name,  
//         options: options,
//         x: "uu", 
//         y: { x: "ghhg"}
//       };
//       setMessages(messages => [...messages, new_message]);
//       chatChannel.push('new_message', new_message);
//   };
//   export const pushOptions = (option, type, setMessages, chatChannel)=>{
//     const new_option =  {
//       option: option,
//       contentType: type
//     };
//     setMessages(messages => [...messages, new_option]);
//     chatChannel.push('new_option', new_message);
// };
  
  export const adjustTextMessage = (text) => {
    return text.trim();
  };
  
  export const isMessageEmpty = (text, fileAttached) => {
    let textLength = adjustTextMessage(text).length;
    let fileLength = fileAttached.length;
    if (
      (!textLength && fileLength) ||
      (textLength && !fileLength) ||
      (textLength && fileLength)
    ) {
      return false;
    } else {
      return true;
    }
  };

  export const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  }

  export const getMaxInArray = (arr) => {
    if(!arr?.length) return 0;
    else return Math.max(...arr);
  }

  export const getSingularOrPlural = (num, text) => {
    return num > 1 ? text + 's' : text;
  }

  export const convertTimestamptoLocalDateTime = (timestamp) => {
    const datetime = new Date(timestamp);
    let time = datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    let date = datetime.toDateString();
    return date +' '+time;
  }

  export const getAllParticipants = (conference, layout) => {
    if(!conference) return [];
    const localUser = conference.getLocalUser();
    const unorderedParticipants = [...conference.getParticipantsWithoutHidden(), { _identity: { user: localUser }, _id: localUser.id }];
    let participants = [];
    let pinnedParticipantId = layout.pinnedParticipant.participantId;
    unorderedParticipants.filter( p => layout.presenterParticipantIds.indexOf(p._id) >= 0).forEach(p=>{
        unorderedParticipants.push({...p, presenter: true});
        participants.push({...p, presenter: true});
    });
    
    unorderedParticipants.forEach(p=>{
        if(p.presenter === true) return;
        if(p._id === pinnedParticipantId){
            let pinnedParticipant = unorderedParticipants.filter(p => p._id === pinnedParticipantId)[0];
            participants.unshift(pinnedParticipant);    
        }
        if(participants.some(participant=> participant._id === p._id && p?.presenter)){
            return;
        }else{
            participants.push({...p});
        }
    });
    return participants;
  }

  export const getRealParticipants = (conference, layout) => {
    if(!conference) return [];
    const participants = getAllParticipants(conference, layout);
    if(participants?.length){
        return participants?.filter(function(participant) {
            if(participant.presenter) return true; 
            if(participant._statsID === "gst-meet" ) return false;
            return true;
        })
    }else{
        return []
    }
  }
