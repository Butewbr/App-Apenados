import { Grid,Paper, Avatar, TextField, Button, Typography,Link, Box } from '@mui/material'
import { FormControlLabel } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { CheckBox } from '@mui/icons-material';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

// import Checkbox from '@material-ui/core/Checkbox';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
// import FormControlLabel from '@material-ui/core/FormControlLabel';


export function LoginPage (){

    const [password, setPassword] = useState("")
    const [userName, setUserName] = useState("")

    const navigate = useNavigate()




    function handleLogin () {
        if(password === "pmsystem" && userName==="12345678"){
            console.log("logou")
            console.log({
                userName, 
                password
            })

            navigate("/dashboard")
        }
    }

    const paperStyle={padding :20,height:'70vh',width:680, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1976d2'}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
                <Avatar   style={avatarStyle}><LockOutlined/></Avatar>
                    <h2>Sign In</h2>
                </Box>
                <TextField onChange={e => setPassword(e.target.value)} label='Username' placeholder='Enter username' variant="outlined" fullWidth required/>
                <TextField onChange={e => setUserName(e.target.value)} sx={{mt: 2}} label='Password' placeholder='Enter password' type='password' variant="outlined" fullWidth required/>
                <FormControlLabel
                    control={
                    <CheckBox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Remember me"
                 />
                <Button onClick={handleLogin} type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                <Typography >
                     <Link href="#" >
                        Esqueceu a palavra-passe ?
                </Link>
                </Typography>
                <Typography > Não tem uma conta ?
                     <Link href="#" >
                        Sign Up 
                </Link>
                </Typography>
            </Paper>
        </Grid>
    )
}