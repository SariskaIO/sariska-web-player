import { Box, Button, Divider, Grid, TextField, Typography, makeStyles } from '@material-ui/core'
import React, { useEffect, useRef, useState } from 'react'
import { extractStreamFromUrl, getRandomColor, getToken, loadVideo } from '../../../../utils'
import StreamingInfo from '../StreamingInfo'
import './index.css';
import ChatInfo from '../ChatInfo'
import topbar from '../../../../utils/toolbar'
import { color } from '../../../../assets/styles/_color'
import { useSelector } from 'react-redux';
import { WEBSOCKET_SERVICE_URL } from '../../../../constants';
import { Socket } from 'phoenix';
import Title from '../../../../components/Title';

const StreamingPlayer = () => {
    const [chat, setChat] = useState(false);
    const [online, setOnline] = useState(false);
    const [isChatOrOnlineClicked, setIsChatOrOnlineClicked] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const auth = useSelector(state => state.auth);
    const profile = useSelector((state) => state.profile);
    const viewerCountRef = useRef(null);
    const {apiKey, isApiKey} = auth;


    const handleChat = async() => {
        setOnline(false);
        setChat(!chat);
        if(!isChatOrOnlineClicked){
            setIsChatOrOnlineClicked(true);
            var stream = extractStreamFromUrl(localStorage.getItem('hlsUrl'));
            await startChatApp(stream);
        }
        if (viewerCountRef.current) {
            viewerCountRef.current.scrollIntoView({ behavior: 'smooth' });
          }
    }

    const handleOnline = async() => {
        setChat(false);
        setOnline(!online);
        if(!isChatOrOnlineClicked){
            setIsChatOrOnlineClicked(true);
            var stream = extractStreamFromUrl(localStorage.getItem('hlsUrl'));
            await startChatApp(stream);
        }
        if (viewerCountRef.current) {
            viewerCountRef.current.scrollIntoView({ behavior: 'smooth' });
          }
    }

    function togglePicker() {
        setPickerVisible(!pickerVisible);
    }


    var hls;
        var isPaused = false;
        var playbackPosition = 0;

        // Function to load HLS URL
        async function loadHls() {
            var hlsUrl = document.getElementById('hlsUrlInput').value;
            if (hlsUrl) {
                // Store HLS URL in localStorage
                var stream = extractStreamFromUrl(hlsUrl);
                await startChatApp(stream);
                loadVideo();
            } else {
                console.log("Please enter an HLS URL");
            }
        }

        function generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
        
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
        
            return result;
        }
        var addedIds = []
        let socket = null;
        let channel =  null;
        
        async function startChatApp(channelName) {
            if (socket) {
                socket.disconnect();
            }
        
            if (channel) {
                channel.leave();
            }
        
            // Clear existing messages and online user lists from the DOM
            if (document.getElementById("msg-list")){    
                document.getElementById("msg-list").innerHTML = '';
                const peopleListMobile = document.getElementById('people_online-list-mobile');      // online people list mobile
                const peopleListDesktop = document.getElementById('people_online-list-desktop');   
                peopleListMobile.innerHTML = '';
                peopleListDesktop.innerHTML = '';
            } 
            // Reset variables
            addedIds = [];
            // And connect to the path in "lib/chat_web/endpoint.ex". We pass the
            // token for authentication. Read below how it should be used.
        
            let userId = sessionStorage.getItem('sariska_live_streaming_userid');
            let userName = sessionStorage.getItem('sariska_live_streaming_username');
            let token =  sessionStorage.getItem("SARISKA_STREAMING_TOKEN");            
            if (token) {
                return token;
            }
        
            if (!userId || !userName) {
                // If id or name doesn't exist, generate random strings
                userId = generateRandomString();
                userName = generateRandomString();
        
                // Store generated id and name in session storage
                sessionStorage.setItem('sariska_live_streaming_userid', userId);
                sessionStorage.setItem('sariska_live_streaming_username', userName);
            }

            socket = new Socket(WEBSOCKET_SERVICE_URL, {params: { token:  await getToken(profile, userName, profile?.color, isApiKey, apiKey, userId)}});
            // Connect to the socket:
            socket.onOpen = () => {
                console.log("Socket opened", socket);
            };
            // Handles socket closing event
            socket.onClose = () => {
                console.log("Connection dropped");
            };
            // Handles socket error events
            socket.onError = (error) => {
                console.log("Socket error", error);
                console.error("There was an error with the connection");
            };
            
            // Open connection to the server
            socket.connect();
            
            // Show progress bar on live navigation and form submits
            window.addEventListener("phx:page-loading-start", info => topbar.delayedShow(200));
            window.addEventListener("phx:page-loading-stop", info => topbar.hide());
        
            /* INITIAL SETUP OF VARIABLES AND JOINING CHANNEL -------------- */
            const ul = document.getElementById('msg-list');                       // list of messages.
            const name = document.getElementById('name');                         // name of message sender
            const msg = document.getElementById('chat');                           // message input field
            const send = document.getElementById('send');                         // send button
            const peopleListMobile = document.getElementById('people_online-list-mobile');      // online people list mobile
            const peopleListDesktop = document.getElementById('people_online-list-desktop');      // online people list desktop
            channel = socket.channel(`chat:${channelName.toLowerCase()}`); // connect to chat "
            /* ONLINE people / PRESENCE FUNCTIONS -------------- */
            // This function will be probably caught when the person first enters the page
            channel.on('presence_state', function (payload) {
                // Array of objects with id and username
                const currentlyOnlinePeople = Object.entries(payload).map(elem => ({username: elem[1].metas[0].name, id: elem[1].metas[0].phx_ref}));
                updateOnlinePeopleList(currentlyOnlinePeople);
            });
            // Listening to presence events whenever a person leaves or joins
            channel.on('presence_diff', function (payload) {
                if(payload.joins && payload.leaves) {
                    // Array of objects with id and username
                    const currentlyOnlinePeople = Object.entries(payload.joins).map(elem => ({username: elem[1].metas[0].name, id: elem[1].metas[0].phx_ref}));
                    const peopleThatLeft = Object.entries(payload.leaves).map(elem => ({username: elem[1].metas[0].name, id: elem[1].metas[0].phx_ref}));
                    updateOnlinePeopleList(currentlyOnlinePeople);
                    removePeopleThatLeft(peopleThatLeft);
                }
            });
        
            channel.on("user_joined", (payload) => {
                // Extract user and room information from the payload
                const user = payload.user;
                const room = payload.room;
            });
        
            channel.join()
            .receive("ok", ()=>console.log("Channel joined"))
            .receive("error", ()=>console.log("Failed to join"))
            .receive("timeout", () => console.log("Encountering network connectivity problems. Waiting for the connection to stabilize."))
        
            function updateOnlinePeopleList(currentlyOnlinePeople) {
                // Set to keep track of added IDs    
                // Add joined people
                for (var i = currentlyOnlinePeople.length - 1; i >= 0; i--) {
                    const name = currentlyOnlinePeople[i].username;
                    const id = currentlyOnlinePeople[i].id;
                    // Check if the ID has already been added
                    if (addedIds.indexOf(id) < 0 ) {
                        addedIds.push(id);
                        if (document.getElementById(name) == null) {
                            var liMobile = document.createElement("li"); // create new person list item DOM element for mobile
                            var liDesktop = document.createElement("li"); // create new person list item DOM element for desktop
                            // <img style="width: 40px; height: 40px; border-radius: 50%" class="w-10 h-10 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-4.jpg" alt=""></img>
                            liMobile.id = id + '_mobile';
                            liDesktop.id = id + '_desktop';
                        liMobile.innerHTML = `
                            <div style="position:relative; display: flex; align-items: center" class="flex items-center gap-4">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill=${color.primaryLight} viewBox="0 0 24 24" style="border: 1px solid ${color.primaryLight}; border-radius: 50%; margin-right: 8px;">
  <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
</svg>
                                <span style="position: absolute; left: 70px; top: 0; background: green" class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                <div style="color: white" class="font-medium dark:text-white">
                                    <div>${sanitizeString(name)}</div>
                                </div>
                            </div>
                        `;
                        
                        liDesktop.innerHTML = `
                            <div style="position:relative; display: flex; align-items: center; margin-bottom: 20px"  class="flex items-center gap-4">
                            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill=${color.primaryLight} viewBox="0 0 24 24" style="border: 1px solid ${color.primaryLight}; border-radius: 50%; margin-right: 8px;">
  <path fill-rule="evenodd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z" clip-rule="evenodd"/>
</svg>

                                <span style="position: absolute; left: 70px; top: 0; background: green" class="top-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                                <div style="color: white; margin-left: 10px" class="font-medium dark:text-white">
                                    <div>${sanitizeString(name)}</div>
                                </div>
                            </div>
                        `;
        
                        peopleListMobile.appendChild(liMobile); // append to people list
                        peopleListDesktop.appendChild(liDesktop); // append to people list
            
                            peopleListMobile.appendChild(liMobile); // append to people list
                            peopleListDesktop.appendChild(liDesktop); // append to people list
            
                            // Add the ID to the set
                        }
                    }
                }
            }
            
        
            function removePeopleThatLeft(peopleThatLeft) {
                // Remove people that left
                for (var i = peopleThatLeft.length - 1; i >= 0; i--) {
                    const name = peopleThatLeft[i].name;
                    const id = peopleThatLeft[i].id;
        
                    const personThatLeftMobile = document.getElementById(id + '_mobile');
                    const personThatLeftDesktop = document.getElementById(id +  '_desktop');
        
                    if (personThatLeftMobile != null && personThatLeftDesktop != null) {
                        peopleListMobile.removeChild(personThatLeftMobile);         // remove the person from list mobile
                        peopleListDesktop.removeChild(personThatLeftDesktop);        // remove the person from list desktop
                    }
                }
            }
        
            /* SENDING MESSAGES FUNCTIONS ------------- */
        
            // Listening to 'shout' events
            channel.on('new_message', function (payload) {
                render_message(payload);
            });
        
            // Listening to 'shout' events
            channel.on('archived_message', function (payload) {
                render_message(payload);
            });
            
            // Send the message to the server on "shout" channel
            function sendMessage() {
                let message =  msg.value
                let content_type = "text"
                if (document.getElementById("fileUrl").value) {
                    message = document.getElementById("fileUrl").value;
                    content_type = "file";
                }
                channel.push('new_message', {      
                    content_type,  
                    content: message,          // get message text (value) from msg input field.
                });
                msg.value = ''; // This will clear the textarea value
        
                // Temporarily disable textarea resizing
                msg.style.resize = 'none';
                if (document.getElementById("fileUrl").value) {
                    document.getElementById("fileUrl").value = "";
                    document.getElementById("attachedDocumentContainer").style.display = "none";
                    document.getElementById("attachedDocumentName").innerHTML = ""
                }
                // Move the cursor to the top of the textarea
                msg.scrollTop = 0;
                
                // Re-enable textarea resizing after a short delay (e.g., 100 milliseconds)
                setTimeout(function() {
                    msg.style.resize = 'auto';
                }, 100);
            }
        
            // The page does not automatically scroll to show the latest message
            // So invoke this after rendering messages to ensure the last one is in view:
            function scroll_latest_message_into_view() {
                window.scrollTo(0, document.documentElement.scrollHeight) // desktop
                ul.scrollTo(0, ul.scrollHeight)                           // mobile
            }
        
            // Render the message with Tailwind styles
            function render_message(payload) {
                const li = document.createElement("li"); // create new list item DOM element
                // Message HTML with Tailwind CSS Classes for layout/style:
        
                let firstCharacter  = payload.created_by_name[0];
                li.innerHTML = `
                <div style="display: block;justify-content: space-between;margin-bottom: 15px;" class="flex flex-row w-[95%] mx-2 border-b-[1px] border-slate-300 py-2">
                <div style="display: flex;" id="user-container">
                    <div style="height: 30px; width: 30px; border-radius: 30px; background: red; margin-right: 5px; display: flex; justify-content: center; align-items: center" class="thumbnail">${firstCharacter}</div>
                    <div class="text-left w-2/5 font-semibold text-slate-800" style="color: ${color.primaryLight}; margin-left: 10px">
                        ${payload.created_by_name}
                    </div>
                </div>
                <div style="max-width: 400px;text-align: left;margin-bottom: 10px; color: ${color.white}; margin-left: 46px" class="flex w-3/5 mx-1 grow">
                    <!-- Conditional rendering -->
                    ${payload.content_type === 'file' ? 
                        (payload.content.toLowerCase().endsWith('.png') || payload.content.toLowerCase().endsWith('.jpg') || payload.content.toLowerCase().endsWith('.jpeg') || payload.content.toLowerCase().endsWith('.gif') ?
                            `<a href="${payload.content}" download="filename">
                                <img src="${payload.content}" alt="File Image" style ="width: 85%">
                             </a>` :
                            `<a href="${payload.content}" download="filename" style ="width: 85%">
                                ${payload.content}
                             </a>`) :
                        payload.content}
                </div>
            </div>
                `
                // Append to list
                ul.appendChild(li);
                scroll_latest_message_into_view();
            }
        
            // Listen for the [Enter] keypress event to send a message:
            msg && msg.addEventListener('keypress', function (event) {
                if (event.keyCode == 13 && (msg.value.length > 0 || document.getElementById("fileUrl").value)) { // don't sent empty msg.
                    sendMessage()
                }
            });
        
            // On "Send" button press
            send && send.addEventListener('click', function (event) {
                if (msg.value.length > 0 || document.getElementById("fileUrl").value) { // don't sent empty msg.
                    sendMessage()
                }
            });
        
        
            /* UTILS ------------ */
        
            // Date formatting
            function formatDate(datetime) {
                const m = new Date(datetime);
                return m.getUTCFullYear() + "/" 
                    + ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" 
                    + ("0" + m.getUTCDate()).slice(-2);
            }
        
            // Time formatting
            function formatTime(datetime) {
                const m = new Date(datetime);
                return ("0" + m.getUTCHours()).slice(-2) + ":"
                    + ("0" + m.getUTCMinutes()).slice(-2) + ":"
                    + ("0" + m.getUTCSeconds()).slice(-2);
            }
        
            // Sanitize string input borrowed from:
            // stackoverflow.com/questions/23187013/sanitize-javascript-string
            function sanitizeString(str){
                str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
                return str.trim();
            }
        }

        useEffect(() => {
            loadVideo();
            //startChatApp(stream);
            let picker;
            const emojiPickerBtn = document.getElementById('emoji-picker');
            function handleClick(evt) {
                evt.preventDefault();
                evt.stopPropagation();
                // if (!picker) {
                //     // picker = new Picker({
                //     //     data: async () => {
                //     //         const response = await fetch(
                //     //         'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
                //     //         );
                //     //         return response.json();
                //     //     },
                //     //     navPosition: "bottom",
                //     //     onEmojiSelect: (emoji) => {
                //     //         document.getElementById("chat").value = document.getElementById("chat").value + emoji.native
                    
                //     //     },
                //     //     onClickOutside: () => {
                //     //         console.log('outside')
                //     //         picker.hidden = true; // Hide picker on clicking outside
                //     //     },
                //     // });
                //     document.getElementById("dummy").appendChild(picker); // Append picker only once
                // } else {
                //     picker.hidden = false; // Toggle visibility efficiently
                // }
                // Optionally uncomment if you want to disable the click handler after first use:
                // emojiPickerBtn.removeEventListener('click', handleClick);
            }
            document.getElementById('uploadButton').addEventListener('click', function() {
                document.getElementById('fileInput').click();
            });

            function getPresignedUrl(params) {
                return new Promise((resolve, reject) => {
                    const body = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${sessionStorage.getItem("SARISKA_STREAMING_TOKEN")}`
                        },
                        body: JSON.stringify({
                            fileType: params.fileType,
                            fileName: params.fileName
                        })
                    };

                    fetch("https://api.sariska.io/api/v1/misc/get-presigned", body)
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

            function handleFileUpload(file, type, fileContent) {
                const signedUrlOptions = {
                    fileName: file,
                    fileType: type
                };
            
                getPresignedUrl(signedUrlOptions).then(values => {
                    const signedUrl = values.presignedUrl;
                    const headers = {
                        "ACL": "public-read",
                        "Content-Disposition": "attachment"
                    };
                    return fetch(signedUrl, { method: 'PUT', body: fileContent, headers });
                })
                .then(res => {
                    document.getElementById("attachedDocumentContainer").style.display = "flex";
                    document.getElementById("attachedDocumentName").innerHTML = file
                    const url = res.url.split("?")[0];
                    document.getElementById("fileUrl").value = url;
                })
                .catch(function (error) {
                    console.log("failed to upload")
                });
            }

            document.getElementById('fileInput').addEventListener('change', function (event) {
                var files = event.target.files
                var filename = files[0].name
                var extension = files[0].type                
                handleFileUpload(filename, extension, files[0]); // Calling the handleFileUpload function with file and fileType as parameters
            });
           // emojiPickerBtn.addEventListener('click', handleClick);
            document.getElementById("attachedDocumentContainerCloseButton").addEventListener('click', ()=>{
                document.getElementById("attachedDocumentContainer").style.display = "none";
                document.getElementById("attachedDocumentName").innerHTML = ""
            });
        },[])
        
        const useStyles = makeStyles(({theme}) => ({
            textField: {
                color: color.white,
                flex: 1, width: '80%',
                '& input': {
                    color: color.white
                },
                '& fieldset': {
                    borderRadius: '28px',
                    borderColor: `${color.white} !important`
                }
            },
            play: {
                borderRadius: '28px', 
                minWidth: '108px', 
                padding: '3px 26px',
                fontWeight: 700, 
                fontSize: '1.2rem', 
                textTransform: 'capitalize', 
                marginLeft: '24px',
                background: color.primaryLight,
                border: `1px solid ${color.primaryLight}`,
                color: color.white,
                '&:hover': {
                    color: color.primaryLight,
                    border: `1px solid ${color.primaryLight}`,
                    background: 'transparent'
                }
            },
            chat: {
                textTransform: 'capitalize', 
                background: chat ? color.primaryLight : '#fff', 
                color: chat ? color.white : 'inherit',
                marginRight: '8px',
                '&:hover': {
                    color: chat ? color.white : color.primaryLight,
                    background: chat ? color.primaryLight : '#fff', 
                }
            },
            online: {
                textTransform: 'capitalize', 
                background: online ? color.primaryLight : '#fff',
                color: online ? color.white : 'inherit',
                '&:hover': {
                    color: online ? color.white : color.primaryLight,
                    background: online ? color.primaryLight : '#fff', 
                }
            }
        }))

    const classes = useStyles();

  return (
    <Box sx={{width: '100%', mt: 8}}>
        <Title title={'Play the Live Streaming URL'} isDivider={true} />
        <Typography variant='h5' style={{color: color.white, textAlign: 'left', marginTop: '48px'}}> 
            Enter the Live Streaming Url:
        </Typography>
    <Box sx={{display: 'flex', alignItems: 'center', width: '90%', mt: 1, mb: 6}}>
        <TextField variant='outlined' defaultValue={"https://vod.sariska.io/2544c8bed3a144eeb2b3163bf8cd0c4b/index.m3u8"} id="hlsUrlInput" placeholder='Enter Playback URL' className={classes.textField} />
        <Button onClick={loadHls} variant='contained' className={classes.play}>Play</Button>
    </Box>
    <Grid container style={{marginTop: '84px', marginBottom: '36px'}}>
        <Grid item md={8}>
        <Box>
            <div id="player_container" ></div>
            {/* <!-- Viewer count UI --> */}
            <div className="viewer-count" id="viewerCount" ref={viewerCountRef}>Currently Viewing: 0</div> 
        </Box>
        </Grid>
        <Grid item md={4}>
            {!chat && !online ? <StreamingInfo /> : null}
            <ChatInfo chat={chat} online={online} pickerVisible={pickerVisible} togglePicker={togglePicker}/>
        </Grid>
      </Grid>
    <Box sx={{position: 'fixed', right: 10, bottom: 10}}>
        <Button className={classes.chat} onClick={handleChat}>
            chat
        </Button>
        <Button className={classes.online} onClick={handleOnline}>
            online
        </Button>
    </Box>
    </Box>
  )
}

export default StreamingPlayer