import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { lightColor, darkColor } from '../assets/styles/_color';

const useColor = () => {
    const theme = useSelector(state => state.theme)?.theme;
    let initialColor = JSON.parse(localStorage.getItem("color-theme")) === 'light' ? lightColor : darkColor;
    const [color, setColor] = useState(initialColor || lightColor );

    useEffect(() => {
        if(theme === 'light'){
            setColor(lightColor);
        }else{
            setColor(darkColor)
        }
        
    },[theme])
    
  return  color;
  
}

export default useColor