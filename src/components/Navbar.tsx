import SearchBar from "./SearchBar";
import { useState } from "react";
import "../stylesheets/Navbar.scss";
import logo from "../logo.png";
import { FaSearch } from "react-icons/fa";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { Input } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onSearch: (query: string) => void;
  cartItemsCount: number;
}

function Navbar({ onSearch, cartItemsCount }: NavbarProps) {
  const location = useLocation();

  const [value, setValue] = useState("");

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
          setValue(e.target.value);
          onSearch(e.target.value);
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
      <Link to="/cart" id="cart-div">
        <div className="cart">
          <div className="item-count"> {cartItemsCount} </div>
          <RiShoppingBag2Fill id="cart-icon" />
        </div>
      </Link>
    </div>
  );
}

export default Navbar;
