import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScreenShare from './components/ScreenShare';
import ScreenView from './components/ScreenView';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/share" element={<ScreenShare />} />
                <Route path="/view" element={<ScreenView />} />
            </Routes>
        </Router>
    );
};

export default App;
