import { FaSearch } from 'react-icons/fa';

function SearchBar() {
  return (
    <div className="search">
      <input
        type="text"
        placeholder="Rechercher..."
        name="searchBar"
        id="searchBar"
        //value={this.props.searchInput}
        //onChange={(e) => this.handleChange(e.target.value)}
      />

      <FaSearch id="search-icon" />
    </div>
  );
}

export default SearchBar;
