import React, { useEffect, useState } from 'react'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import InsertPhotoOutlinedIcon from '@material-ui/icons/InsertPhotoOutlined';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';
import { Box, makeStyles } from '@material-ui/core';
import { Data } from 'emoji-mart';
import Picker from '@emoji-mart/react'
import useColor from '../../../../hooks/useColor';
import { useSelector } from 'react-redux';


const ChatInfo = ({chat, online, pickerVisible, togglePicker}) => {
    const [isOpen, setIsOpen] = useState(false);
    const color = useColor();
    const theme = useSelector(state => state.theme)?.theme;
    const useStyles = makeStyles(theme => ({
        upload: {
            border: 'none', 
            background: color.black1,
            '&:hover': {
                cursor: 'pointer',
                color: color.primaryLight
            },
            '& svg': {
                padding: '4px',
                color: color.secondary, 
                '&:hover': {
                    color: color.primaryLight
                },
            }
        },
        input: {
            flex: 1,
            border: 'none',
            paddingLeft: '4px',
            color: color.white,
            background: color.black1,
            '&:focus': {
                border: 'none',
                outline: 'none'
            }
        }
    }))
    const classes = useStyles();

    useEffect(()=>{
        setIsOpen(isOpen)
    },[color])

  return (
    <>
    <div className="chatContainer">
            <div style={{maxHeight: "calc(100vh - 200px)", minHeight: "calc(100vh - 200px)", display: chat || online ? 'block' : 'none'}} id="chat-container" className="max-h-screen flex flex-col lg:flex-row lg:min-h-screen ">
                <div style={{display: chat ? 'block' : 'none', width: '90%', height: "calc(100vh - 272px)", position: 'relative', margin: 'auto'}}>
                    <div style={{height: '105%', border: `1px solid ${color.whiteLight}`, borderRadius: '10px'}} className="flex flex-col lg:flex-grow relative ml-4 mr-4 mb-4 border-2 radius rounded-md">
                        {/* <!-- The list of messages will appear here: --> */}
                        <ul id="msg-list" style={{overflowY: 'auto', height: '96%', listStyleType: 'none'}} phx-update="append" className="pa-1 lg:mt-[4rem] overflow-y-auto"></ul>
                    </div>
                    <footer id="footer" style={{position: "absolute", bottom: "-80px", width:"100%", paddingLeft: 0}} className="bg-slate-800 p-2 w-full h-[3rem] bottom-0 flex justify-center sticky">
                        <div className="w-full flex flex-row items-center text-gray-700 focus:outline-none font-normal pl-4">
                            <div>
                                <label htmlFor="chat" aria-label="Your message"></label>
                                <div id="dummy"></div>
                                <div style={{display: 'flex', width: '100%', borderRadius: '5px', background: color.secondary, border: `1px solid ${color.whiteLight}`}} className="flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                                    <div style={{position: "absolute", top: "-45px", background: "#a5c3f0", alignItems: 'center', padding: '8px', color: '#3b9090', width: "96%",display: "none", justifyContent: "space-between", borderRadius: '8px', left: 0}} id="attachedDocumentContainer" className="flex items-center mx-4">
                                        <span id="attachedDocumentName" className="text-sm text-gray-700 dark:text-gray-300 truncate"></span>
                                        <input type="text" value="" id="fileUrl" style={{display: "none"}} />
                                        <button style={{background: 'none', border: 'none'}} id="attachedDocumentContainerCloseButton" type="button" className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                            <CloseIcon />
                                        </button>
                                    </div>
                                    <input type="file" id="fileInput" style={{display: "none"}} />
                                    <button id="uploadButton" className={classes.upload} style={{padding: '4px 0 4px 4px', borderRadius: '5px 0 0 5px'}} type="button">
                                        <InsertPhotoOutlinedIcon style={{color: color.white}} />
                                    </button>
                                    <Box sx={{position: 'absolute', bottom: '50px'}}>
                                    {pickerVisible && (<Picker id='picker-emoji'
                                        data={Data} 
                                        onEmojiSelect={(emoji) => {
                                            document.getElementById("chat").value = document.getElementById("chat").value + emoji.native
                                        }} 
                                        onClickOutside={() =>togglePicker() }
                                        navPosition = "bottom"
                                    />)}
                                    </Box>
                                    <button id="emoji-picker" onClick={togglePicker} className={classes.upload} style={{padding: '4px 4px 4px 0px'}} type="button">
                                        <InsertEmoticonIcon style={{color: color.white}} />
                                    </button>
                                    <input id="chat" rows="1" className={classes.input} placeholder="Your message..." />
                                    <button id="send" type="submit" className={classes.upload} style={{borderRadius: '0px 5px 5px 0px'}}>
                                       <SendIcon style={{color: color.primaryLight}} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </footer>
                    </div> 
                    {/* <!-- Online people will only be shown here on desktop devices --> */}
                    <div className="hidden lg:flex" style={{display: online ? 'block' : 'none', height: '100%', width: '90%', margin: 'auto'}}>
                        <div style={{maxHeight: "calc(100vh - 200px)", minHeight: "calc(100vh - 200px)", overflowY: "scroll", border: `1px solid ${color.whiteLight}`, borderRadius: '10px'}}>
                            <div style={{display: 'flex', justifyContent: 'start', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap'}}>
                                <h4 style={{color: 'green'}} className="text-md leading-tight font-medium mb-2 text-green-700">online members</h4>
                                <ul style={{listStyleType: 'none'}} id="people_online-list-desktop" phx-update="append" className="pa-1"></ul>
                            </div>
                        </div>
                    </div>
                    </div>
                    {/* <!-- Shown only on mobile devices --> */}
                     <div id={"online-container"} style={{display: 'none', height: '100%', maxHeight: "calc(100vh - 200px)", minHeight: "calc(100vh - 200px)", overflowY: "scroll", border: `1px solid ${color.whiteLight}`, borderRadius: '10px'}} className={"mt-[5rem] p-4 ml-4 mr-4 mb-4 border-2 radius rounded-md lg:hidden"}
                    onClick={() => setIsOpen(!isOpen)}>
                        <div style={{display: 'flex', justifyContent: 'start', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap'}} className="flex justify-start flex-col overflow-hidden whitespace-nowrap">
                            <h4 style={{color: 'green'}} className="text-md leading-tight font-medium mb-2 text-green-700">online members</h4>
                            <ul style={{listStyleType: 'none'}} id="people_online-list-mobile" phx-update="append" className="pa-1"></ul>
                        </div>
                    </div>
            
        </div>
        </>
  )
}

export default ChatInfo