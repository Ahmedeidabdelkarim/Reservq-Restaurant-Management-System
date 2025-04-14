import React, { useState, useEffect, useRef } from "react";
import { Form, InputGroup, Button, ListGroup, Spinner, Image } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setSelectedIndex(-1);
      setShowResults(false);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchData(query);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchData = async (searchTerm) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/v1/products`);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      const foodArray = Array.isArray(data) ? data : data.foods;
  
      if (!foodArray || !Array.isArray(foodArray)) {
        throw new Error("Unexpected API response structure");
      }
  
      const filteredResults = foodArray.filter((item) =>
        item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      setResults(filteredResults);
      setShowResults(true);
    } catch (error) {
      console.error("Error fetching data:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex < results.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleItemClick(results[selectedIndex]);
    } else if (e.key === "Escape") {
      setShowResults(false);
      setQuery("");
    }
  };

  const handleItemClick = (item) => {
    navigate(`/item/${item.id}`);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  return (
    <div className="search-container" ref={searchContainerRef}>
      <Button 
        variant="transparent" 
        className="search-icon-button"
        onClick={() => {
          searchInputRef.current?.focus();
          setShowResults(true);
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.833 22.1667C18.433 22.1667 22.1667 18.433 22.1667 13.833C22.1667 9.233 18.433 5.5 13.833 5.5C9.233 5.5 5.5 9.233 5.5 13.833C5.5 18.433 9.233 22.1667 13.833 22.1667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.5 22.5L20.5 20.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Button>

      <div className={`search-dropdown ${showResults ? 'show' : ''}`}>
        <div className="search-dropdown-content">
          <Form className="search-form">
            <InputGroup>
              <Form.Control
                ref={searchInputRef}
                type="search"
                placeholder="Search Food..."
                className="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowResults(true)}
              />
            </InputGroup>
          </Form>

          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" size="sm" />
            </div>
          )}

          {showResults && results.length > 0 && (
            <ListGroup className="search-results">
              {results.map((item, index) => (
                <ListGroup.Item
                  key={item.id}
                  className={`d-flex align-items-center ${
                    selectedIndex === index ? "active" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <Image
                    src={item.images && item.images.length > 0 ? item.images[0] : "https://reservq.vercel.app/assets/dashboard-menu-profile-img-c3af5256.png"}
                    roundedCircle
                    width={50}
                    height={50}
                    className="me-2"
                    onError={(e) => {
                      e.target.src = "https://reservq.vercel.app/assets/dashboard-menu-profile-img-c3af5256.png";
                    }}
                  />
                  <div>
                    <div className="text-start">{item.name}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
