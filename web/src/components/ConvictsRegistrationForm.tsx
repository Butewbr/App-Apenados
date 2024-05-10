import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, InputLabel, MenuItem, Select, TextField, TextareaAutosize } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export  function ConvictsRegistrationForm() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [relevancia, setRelevancia] = React.useState('');

  const handleSelectChange = (event: SelectChangeEvent) => {
    setRelevancia(event.target.value as string);
  };

  return (
    <Box sx={{ width: '100%' }}>

      <Typography variant='h5'>Cadastro de Apenados</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Informações Penais" {...a11yProps(0)} />
          <Tab label="Informações Pessoais" {...a11yProps(1)} />
          <Tab label="Crimes" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" width="100%" gap={2}>
        {/* <Typography>Informações de Acesso</Typography> */}
         <TextField label="Vara" fullWidth />
          <TextField label="Nº Autos" fullWidth/>
          <TextField type='date' label="Data de ínicio" placeholder=''  fullWidth/>
          <TextField type='date' label="Data de fim" placeholder=''  fullWidth/>
          
        </Box>


        {/* <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Dados pessoais</Typography>
         <TextField label="Nome" fullWidth />
          <TextField label="Sobrenome" fullWidth/>
          <TextField  label="CPF" fullWidth/>
        </Box>


        <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Dados profissionais</Typography>
         <TextField  label="Cargo" fullWidth />
          <TextField label="Unidade Policial" fullWidth/>
          <TextField label="Situação" fullWidth/>
        </Box> */}

     
        </Box>

        <Button variant='contained' sx={{mt:2}}>SALVAR</Button>
      </CustomTabPanel>
      {/* <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel> */}
      <CustomTabPanel value={value} index={2}>
      <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" width="100%" gap={2}>
        {/* <Typography>Informações de Acesso</Typography> */}
         <TextField label="Crime" fullWidth />
         <InputLabel id="demo-simple-select-label">Relevância</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={relevancia}
          label="Age"
          onChange={handleSelectChange}
        >
          <MenuItem value={10}>Ativo</MenuItem>
          <MenuItem value={20}>Exem1</MenuItem>
          <MenuItem value={30}>Exem2</MenuItem>

          </Select>
         
          
        </Box>


        {/* <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Dados pessoais</Typography>
         <TextField label="Nome" fullWidth />
          <TextField label="Sobrenome" fullWidth/>
          <TextField  label="CPF" fullWidth/>
        </Box>


        <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Dados profissionais</Typography>
         <TextField  label="Cargo" fullWidth />
          <TextField label="Unidade Policial" fullWidth/>
          <TextField label="Situação" fullWidth/>
        </Box> */}

     
        </Box>
      </CustomTabPanel>
    </Box>
  );
}