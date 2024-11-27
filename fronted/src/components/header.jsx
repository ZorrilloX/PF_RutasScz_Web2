import React from 'react';
import { Button } from 'react-bootstrap';

const Header = () => {
    return (
        <header className="text-center my-4">
            <Button 
                variant="primary" 
                onClick={() => window.location.href = 'http://localhost:5173/pokeapi/'}
            >
                Ir a PokeAPI
            </Button>
        </header>
    );
};

export default Header;
