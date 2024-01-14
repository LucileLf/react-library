import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import "../stylesheets/Navbar.scss";
import logo from "../assets/logo.png";
import { FaSearch } from "react-icons/fa";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Input, Button, Stack } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { debounce } from 'lodash';

interface NavbarProps {
  onSearch: (query: string) => void;
  cartItemsCount: number;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

function Navbar({ onSearch, cartItemsCount, isLoggedIn, setIsLoggedIn }: NavbarProps) {
  const location = useLocation();

  const [value, setValue] = useState("");

  //debounced function to call onSearch with the latest value
  const debouncedSearch = debounce((searchValue) => {
    onSearch(searchValue);
  }, 1000);

  if (location.pathname === "/cart")
    return (
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} className="logo-img" alt="logo" />
          </Link>
        </div>
      </div>
    );

    
  return (
    <div className="navbar">
      {/* <div className="logo">
        <img src={logo} className="logo-img" alt="logo" />
      </div> */}
      <div className="logo">
        <Link to="/">
          <img src={logo} className="logo-img" alt="logo" />
        </Link>
      </div>

      {/* BEGIN SEARCH BAR */}
      <Input
        variant="filled"
        placeholder={value ? "" : "Rechercher..."}
        value={value}
        borderRadius={20}
        width="60vw"
        onChange={(e) => {
          const searchValue = e.target.value;
          setValue(searchValue);
          debouncedSearch(searchValue); // Call the debounced function
        }}
      />

      {/* <div className="search">
            <input
                type="text"
                placeholder="Rechercher..."
                name="searchBar"
                id="searchBar"
                //value={this.props.searchInput}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <FaSearch id="search-icon" />
        </div> */}
      {/* END SEARCH BAR */}
      {isLoggedIn &&
      <Stack>
        <Link to="/cart" id="cart-div">
          <div className="cart">
            <div className="item-count"> {cartItemsCount} </div>
            <RiShoppingBag2Fill id="cart-icon" />
          </div>
        </Link>
        <Link to="/">
          <Button colorScheme='blue' className="submit-button" onClick={()=>setIsLoggedIn(false)}>
            Déconnexion
          </Button>
        </Link>
      </Stack>}
    </div>
  );
}

export default Navbar;
