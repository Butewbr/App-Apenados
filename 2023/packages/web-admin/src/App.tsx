import React, {useState, useEffect, SetStateAction} from 'react';
import {Routes, Route, Link, useLocation} from 'react-router-dom';

import './App.css';
import Listagem from './components/Listagem';
import AltPenal from './components/AltPenal';
import api from '@ronda-penal/axios-config';

function App() {
  const location = useLocation();

  return (
    <div
      style={
        location.pathname == '/'
          ? {
              placeItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              height: '100vh',
              verticalAlign: 'middle'
            }
          : {}
      }>
      <div
        className="router-container"
        style={location.pathname == '/' ? {position: 'relative'} : {}}>
        <div className="router">
          <h1 style={{margin: '.35em 0'}}>
            Ronda Penal
            {location.pathname != '/' ? '' : ''}
          </h1>
          <nav>
            <ul style={{margin: '0 0 1em 0'}}>
              <li>
                <Link to="/AltPenal">Cadastrar Nova Alternativa Penal</Link>
              </li>
              <li>
                <Link to="/Listagem">
                  Listar Alternativas Penais Cadastradas
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <Routes>
        <Route path="/Listagem" element={<Listagem />} />
        <Route path="/AltPenal" element={<AltPenal />} />
      </Routes>
    </div>
  );
}

export default App;
