import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';

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

export  function PmFormTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>

      <Typography variant='h5'>Cadastro de PM's</Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Informações Gerais" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box display="flex" gap={2}>
        <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Informações de Acesso</Typography>
         <TextField label="Matrícula" fullWidth />
          <TextField label="Senha" fullWidth/>
          <TextField label="Confirmar senha" fullWidth/>
        </Box>


        <Box display="flex" flexDirection="column" width="100%" gap={1}>
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
        </Box>

        <Box display="flex" flexDirection="column" width="100%" gap={1}>
        <Typography>Contato</Typography>
         <TextField type='tel' label="Telefone" fullWidth />
          <TextField type='email' label="Email" fullWidth/>
        </Box>
        </Box>

        <Button variant='contained' sx={{mt:2}}>Cadastrar PM</Button>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Item Three
      </CustomTabPanel>
    </Box>
  );
}