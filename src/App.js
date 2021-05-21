import React from 'react'; 
import './App.css';
import Main from './Components/Main'; 

import {BrowserRouter} from 'react-router-dom';

import {provider} from 'react-redux';
import {store} from './redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
