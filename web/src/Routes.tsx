import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login";

import {DashboardLayout} from "./layouts/DashboardLayout";
import { DashboardHomePage } from "./pages/Home";
import { ConvictsRegistrationPage } from "./pages/ConvictsRegistration/indext";
import { ConvictsDatasPage } from "./pages/ConvictsDatas/indext";
import { PmRegistrationPage } from "./pages/PmRegistration";
import { PmDatasPage } from "./pages/PmDatas";




const routes = [{
  label: "Cadastro de Sentenciados", 
  route: "dashboard/convicts-registration"
}, {
  label: 'Banco de Sentenciados', 
  route: "dashboard/convicts-datas"
}, {
  label: "Cadastro de PM", 
  route: "dashboard/pm-registration"
}, {
  label:"Banco de PM", 
  route:"dashboard/pm-datas"
}]

export function Router () {
  return (
    <Routes>
        <Route path="/" element={<LoginPage />} />
      
      <Route path="dashboard" element={<DashboardLayout />}>

        <Route path="" element={<DashboardHomePage/>} />

        <Route path="convicts-registration" element={<ConvictsRegistrationPage/>} />
        <Route path="convicts-datas" element={<ConvictsDatasPage/>} />

        <Route path="pm-registration" element={<PmRegistrationPage/>} />
        <Route path="pm-datas" element={<PmDatasPage/>} />
      </Route>


      <Route path="*" element={<h1>Página não encontrada</h1>}/>
    </Routes>
  )
}


