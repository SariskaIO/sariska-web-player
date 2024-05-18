import { Box, Grid, Typography } from '@material-ui/core'
import React from 'react'
import WithOrWithoutApiKey from './WithOrWithoutApiKey'
import MediaLinks from './MediaLinks'

const MediaSetUp = ({isApiKey, apiKeyValue, handleChange, next, setNext, setIsApiKey, error, setError, list}) => {
  return (
    <div>
        <Box sx={{textAlign: 'center', mt: 4}}>
                <Typography variant='h3'></Typography>
            </Box>
            <Grid container xs={12}>
                <WithOrWithoutApiKey 
                    isApiKey={isApiKey} 
                    apiKeyValue={apiKeyValue} 
                    handleChange={handleChange} 
                    next={next} 
                    setIsApiKey={setIsApiKey}
                    error={error}
                    setError={setError}
                />
            </Grid>
            <Grid container xs={12}>
                <MediaLinks 
                    isApiKey={isApiKey} 
                    list={list} 
                    apiKeyValue={apiKeyValue} 
                    setNext={setNext}
                    setError={setError}
                />
            </Grid>
    </div>
  )
}

export default MediaSetUp